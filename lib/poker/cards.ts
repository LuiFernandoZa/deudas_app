export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";

export type Suit =
  | "s"
  | "h"
  | "d"
  | "c";

export type Card = {
  rank: Rank;
  suit: Suit;
};

export const ranks: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

export const suits: Suit[] = [
  "s",
  "h",
  "d",
  "c",
];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push({
        rank,
        suit,
      });
    }
  }

  return deck;
}