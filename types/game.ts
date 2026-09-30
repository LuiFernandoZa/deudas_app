export type PlayerName =
  | "Kisho"
  | "Loro"
  | "Yorbin"
  | "ZA";

export interface Player {
  id: string;
  name: PlayerName;
}

export interface Balance {
  id: string;
  playerA: PlayerName;
  playerB: PlayerName;
  amount: number;
}

export interface GameState {
  players: Player[];
  balances: Balance[];
}