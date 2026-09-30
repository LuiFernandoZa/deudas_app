import type { GameState } from "@/types/game";

export const initialGame: GameState = {
  players: [
    {
      id: "kisho",
      name: "Kisho",
    },
    {
      id: "loro",
      name: "Loro",
    },
    {
      id: "yorbin",
      name: "Yorbin",
    },
    {
      id: "za",
      name: "ZA",
    },
  ],

  balances: [],
};