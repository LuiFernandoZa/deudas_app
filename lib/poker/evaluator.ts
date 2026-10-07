import type { Card } from "./cards";

export type HandCategory =
  | "high-card"
  | "pair"
  | "two-pair"
  | "three-of-a-kind"
  | "straight"
  | "flush"
  | "full-house"
  | "four-of-a-kind"
  | "straight-flush";

export type HandValue = {
  category: HandCategory;
  rank: number[];
};

function rankValue(rank: Card["rank"]): number {
  const values: Record<Card["rank"], number> = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };

  return values[rank];
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

  for (let i = 0; i <= items.length - size; i++) {
    const first = items[i];

    const remaining = items.slice(i + 1);

    for (const combination of combinations(
      remaining,
      size - 1
    )) {
      result.push([
        first,
        ...combination,
      ]);
    }
  }

  return result;
}

function evaluateFive(
  cards: Card[]
): HandValue {
  const values = cards
    .map((card) => rankValue(card.rank))
    .sort((a, b) => b - a);

  const counts = new Map<number, number>();

  for (const value of values) {
    counts.set(
      value,
      (counts.get(value) ?? 0) + 1
    );
  }

  const groups = [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return b[0] - a[0];
    });

  const uniqueValues = [...new Set(values)];

  let straightHigh = 0;

  if (
    uniqueValues.includes(14) &&
    uniqueValues.includes(5) &&
    uniqueValues.includes(4) &&
    uniqueValues.includes(3) &&
    uniqueValues.includes(2)
  ) {
    straightHigh = 5;
  } else {
    for (let i = 0; i <= uniqueValues.length - 5; i++) {
      const sequence = uniqueValues.slice(
        i,
        i + 5
      );

      if (
        sequence[0] -
          sequence[4] ===
        4
      ) {
        straightHigh = sequence[0];
        break;
      }
    }
  }

  const flush = cards.every(
    (card) =>
      card.suit === cards[0].suit
  );

  if (flush && straightHigh > 0) {
    return {
      category: "straight-flush",
      rank: [straightHigh],
    };
  }

  if (groups[0][1] === 4) {
    return {
      category: "four-of-a-kind",
      rank: [
        groups[0][0],
        groups[1][0],
      ],
    };
  }

  if (
    groups[0][1] === 3 &&
    groups[1][1] === 2
  ) {
    return {
      category: "full-house",
      rank: [
        groups[0][0],
        groups[1][0],
      ],
    };
  }

  if (flush) {
    return {
      category: "flush",
      rank: values,
    };
  }

  if (straightHigh > 0) {
    return {
      category: "straight",
      rank: [straightHigh],
    };
  }

  if (groups[0][1] === 3) {
    return {
      category: "three-of-a-kind",
      rank: [
        groups[0][0],
        ...groups
          .slice(1)
          .map(([value]) => value),
      ],
    };
  }

  if (
    groups[0][1] === 2 &&
    groups[1][1] === 2
  ) {
    const pairs = [
      groups[0][0],
      groups[1][0],
    ].sort((a, b) => b - a);

    return {
      category: "two-pair",
      rank: [
        ...pairs,
        groups[2][0],
      ],
    };
  }

  if (groups[0][1] === 2) {
    return {
      category: "pair",
      rank: [
        groups[0][0],
        ...groups
          .slice(1)
          .map(([value]) => value),
      ],
    };
  }

  return {
    category: "high-card",
    rank: values,
  };
}

const categoryValue: Record<
  HandCategory,
  number
> = {
  "high-card": 0,
  pair: 1,
  "two-pair": 2,
  "three-of-a-kind": 3,
  straight: 4,
  flush: 5,
  "full-house": 6,
  "four-of-a-kind": 7,
  "straight-flush": 8,
};

export function compareHands(
  a: HandValue,
  b: HandValue
): number {
  if (
    categoryValue[a.category] !==
    categoryValue[b.category]
  ) {
    return (
      categoryValue[a.category] -
      categoryValue[b.category]
    );
  }

  for (
    let i = 0;
    i < Math.max(
      a.rank.length,
      b.rank.length
    );
    i++
  ) {
    const difference =
      (a.rank[i] ?? 0) -
      (b.rank[i] ?? 0);

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

export function evaluateHand(
  cards: Card[]
): HandValue {
  if (cards.length < 5) {
    throw new Error(
      "Se necesitan al menos 5 cartas."
    );
  }

  const possibleHands =
    combinations(cards, 5);

  let bestHand = evaluateFive(
    possibleHands[0]
  );

  for (
    let i = 1;
    i < possibleHands.length;
    i++
  ) {
    const current =
      evaluateFive(
        possibleHands[i]
      );

    if (
      compareHands(
        current,
        bestHand
      ) > 0
    ) {
      bestHand = current;
    }
  }

  return bestHand;
}