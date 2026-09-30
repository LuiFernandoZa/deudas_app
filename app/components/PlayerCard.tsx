"use client";

import type {
  Balance,
  Player,
  PlayerName,
} from "@/types/game";

import BalanceRow from "./BalanceRow";

interface Props {
  player: PlayerName;
  players: Player[];
  balances: Balance[];

  onIncrease: (
    playerA: PlayerName,
    playerB: PlayerName
  ) => void;

  onDecrease: (
    playerA: PlayerName,
    playerB: PlayerName
  ) => void;
}

export default function PlayerCard({
  player,
  players,
  balances,
  onIncrease,
  onDecrease,
}: Props) {

  const others = players.filter(
    (item) => item.name !== player
  );

  return (
    <article className="playerCard">

      <header className="playerCardHeader">
        <h2>{player}</h2>
      </header>

      <div className="balanceList">

        {others.map((other) => (

          <BalanceRow
            key={other.id}
            playerA={player}
            playerB={other.name}
            balances={balances}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

        ))}

      </div>

    </article>
  );
}