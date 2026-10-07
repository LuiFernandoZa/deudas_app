import {
  createDeck,
  type Card,
} from "./cards";

import {
  compareHands,
  evaluateHand,
} from "./evaluator";

export type EquityResult = {
  heroEquity: number;
  villainEquity: number;
  ties: number;
  total: number;
};

function sameCard(
  a: Card,
  b: Card
): boolean {
  return (
    a.rank === b.rank &&
    a.suit === b.suit
  );
}

function removeKnownCards(
  deck: Card[],
  knownCards: Card[]
): Card[] {
  return deck.filter(
    (card) =>
      !knownCards.some((known) =>
        sameCard(card, known)
      )
  );
}

function combinations<T>(
  items: T[],
  size: number
): T[][] {
  if (size === 0) {
    return [[]];
  }

  if (items.length < size) {
    return [];
  }

  const result: T[][] = [];

  for (
    let i = 0;
    i <= items.length - size;
    i++
  ) {
    const first = items[i];

    const remaining =
      items.slice(i + 1);

    for (
      const combination of
        combinations(
          remaining,
          size - 1
        )
    ) {
      result.push([
        first,
        ...combination,
      ]);
    }
  }

  return result;
}

export function calculateEquity(
  hero: Card[],
  villain: Card[],
  board: Card[]
): EquityResult {
  const knownCards = [
    ...hero,
    ...villain,
    ...board,
  ];

  const deck = removeKnownCards(
    createDeck(),
    knownCards
  );

  const cardsNeeded =
    5 - board.length;

  const runouts =
    combinations(
      deck,
      cardsNeeded
    );

  let heroWins = 0;
  let villainWins = 0;
  let ties = 0;

  for (const runout of runouts) {
    const finalBoard = [
      ...board,
      ...runout,
    ];

    const heroHand =
      evaluateHand([
        ...hero,
        ...finalBoard,
      ]);

    const villainHand =
      evaluateHand([
        ...villain,
        ...finalBoard,
      ]);

    const result =
      compareHands(
        heroHand,
        villainHand
      );

    if (result > 0) {
      heroWins++;
    } else if (result < 0) {
      villainWins++;
    } else {
      ties++;
    }
  }

  const total = runouts.length;

  return {
    heroEquity:
      ((heroWins +
        ties / 2) /
        total) *
      100,

    villainEquity:
      ((villainWins +
        ties / 2) /
        total) *
      100,

    ties,
    total,
  };
}