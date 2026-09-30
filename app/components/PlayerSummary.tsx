import type {
  Player,
  Balance,
  PlayerName,
} from "@/types/game";

interface Props {
  players: Player[];
  balances: Balance[];

  getTotal: (
    balances: Balance[],
    player: PlayerName
  ) => number;
}

export default function PlayerSummary({
  players,
  balances,
  getTotal,
}: Props) {

  const resultados = players
    .map((player) => ({
      ...player,

      total: getTotal(
        balances,
        player.name
      ),
    }))
    .sort(
      (a, b) =>
        b.total - a.total
    );

  return (
    <section className="summary">

      <div className="summaryHeader">
        <h2>Resultados</h2>
      </div>

      <div className="summaryPlayers">

        {resultados.map((player) => (

          <div
            className="summaryPlayer"
            key={player.id}
          >

            <span>
              {player.name}
            </span>

            <strong
              className={
                player.total >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {player.total >= 0
                ? "+"
                : "-"}
              S/
              {Math.abs(
                player.total
              ).toFixed(2)}
            </strong>

          </div>

        ))}

      </div>

    </section>
  );
}