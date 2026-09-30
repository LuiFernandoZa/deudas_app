"use client";

import type {
  Balance,
  PlayerName,
} from "@/types/game";

import { getBalanceBetween } from "@/lib/game";

interface Props {
  playerA: PlayerName;
  playerB: PlayerName;
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

export default function BalanceRow({
  playerA,
  playerB,
  balances,
  onIncrease,
  onDecrease,
}: Props) {

  const balance = getBalanceBetween(
    balances,
    playerA,
    playerB
  );

  return (
    <div className="balanceRow">

      <span className="balanceName">
        {playerB}
      </span>

      <strong
        className={
          balance >= 0
            ? "positive"
            : "negative"
        }
      >
        {balance >= 0 ? "+" : "-"}
        S/
        {Math.abs(balance).toFixed(2)}
      </strong>

      <div className="balanceActions">

        <button
          type="button"
          onClick={() =>
            onDecrease(
              playerA,
              playerB
            )
          }
        >
          −
        </button>

        <button
          type="button"
          onClick={() =>
            onIncrease(
              playerA,
              playerB
            )
          }
        >
          +
        </button>

      </div>

    </div>
  );
}