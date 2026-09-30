import type {
  Balance,
  PlayerName,
} from "@/types/game";

export function getBalanceBetween(
  balances: Balance[],
  playerA: PlayerName,
  playerB: PlayerName
): number {

  const direct = balances.find(
    (balance) =>
      balance.playerA === playerA &&
      balance.playerB === playerB
  );

  if (direct) {
    return direct.amount;
  }

  const inverse = balances.find(
    (balance) =>
      balance.playerA === playerB &&
      balance.playerB === playerA
  );

  if (inverse) {
    return -inverse.amount;
  }

  return 0;
}

export function getPlayerTotal(
  balances: Balance[],
  player: PlayerName
): number {

  return balances.reduce(
    (total, balance) => {

      if (balance.playerA === player) {
        return total + balance.amount;
      }

      if (balance.playerB === player) {
        return total - balance.amount;
      }

      return total;
    },
    0
  );
}