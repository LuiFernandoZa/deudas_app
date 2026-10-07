"use client";

import type {
  Card,
  Rank,
  Suit,
} from "@/lib/poker/cards";

type Props = {
  cards: Card[];
  maxCards: number;
  onChange: (
    cards: Card[]
  ) => void;
};

const ranks: Rank[] = [
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

const suits: Suit[] = [
  "s",
  "h",
  "d",
  "c",
];

const suitSymbols: Record<
  Suit,
  string
> = {
  s: "♠",
  h: "♥",
  d: "♦",
  c: "♣",
};

export default function CardSelector({
  cards,
  maxCards,
  onChange,
}: Props) {
  function addCard(
    rank: Rank,
    suit: Suit
  ) {
    if (cards.length >= maxCards) {
      return;
    }

    const alreadyExists =
      cards.some(
        (card) =>
          card.rank === rank &&
          card.suit === suit
      );

    if (alreadyExists) {
      return;
    }

    onChange([
      ...cards,
      {
        rank,
        suit,
      },
    ]);
  }

  function removeCard(
    index: number
  ) {
    onChange(
      cards.filter(
        (_, i) => i !== index
      )
    );
  }

  return (
    <div className="cardSelector">
      <div className="selectedCards">
        {cards.map(
          (card, index) => (
            <button
              key={`${card.rank}${card.suit}`}
              onClick={() =>
                removeCard(index)
              }
              className="pokerCard"
            >
              {card.rank}
              {suitSymbols[card.suit]}
            </button>
          )
        )}
      </div>

      <div className="cardGrid">
        {ranks.map((rank) =>
          suits.map((suit) => (
            <button
              key={`${rank}${suit}`}
              onClick={() =>
                addCard(
                  rank,
                  suit
                )
              }
              disabled={
                cards.some(
                  (card) =>
                    card.rank ===
                      rank &&
                    card.suit ===
                      suit
                )
              }
              className="cardOption"
            >
              {rank}
              {suitSymbols[suit]}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

