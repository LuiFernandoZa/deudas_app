"use client";

import { useEffect, useState } from "react";

import { initialGame } from "@/data/game";

import type {
  Balance,
  PlayerName,
} from "@/types/game";

import {
  getPlayerTotal,
} from "@/lib/game";

import { createClient } from "@/lib/supabase/client";

import PlayerSummary from "./components/PlayerSummary";
import PlayerCard from "./components/PlayerCard";
import AmountModal from "./components/AmountModal";
import Toast from "./components/Toast";

export default function Home() {

  const [game, setGame] =
    useState(initialGame);

  const [modal, setModal] =
    useState<{
      playerA: PlayerName;
      playerB: PlayerName;
      type:
        | "increase"
        | "decrease";
    } | null>(null);

  const [toast, setToast] =
    useState<string | null>(null);


  // ==========================================
  // CARGAR DATOS DESDE SUPABASE
  // ==========================================

  useEffect(() => {

    async function loadGame() {

      const supabase =
        createClient();


      // --------------------------------------
      // CARGAR JUGADORES
      // --------------------------------------

      const {
        data: players,
        error: playersError,
      } = await supabase
        .from("players")
        .select("*")
        .order("name");


      if (playersError) {

        console.error(
          "Error cargando jugadores:",
          playersError
        );

        return;
      }


      // --------------------------------------
      // CARGAR BALANCES
      // --------------------------------------

      const {
        data: balances,
        error: balancesError,
      } = await supabase
        .from("balances")
        .select("*");


      if (balancesError) {

        console.error(
          "Error cargando balances:",
          balancesError
        );

        return;
      }


      // --------------------------------------
      // CONVERTIR JUGADORES
      // --------------------------------------

      const formattedPlayers =
        players.map((player) => ({
          id: player.id,
          name: player.name as PlayerName,
        }));


      // --------------------------------------
      // CREAR MAPA DE ID → NOMBRE
      // --------------------------------------

      const playerNames =
        new Map<string, PlayerName>(
          players.map((player) => [
            player.id,
            player.name as PlayerName,
          ])
        );


      // --------------------------------------
      // CONVERTIR BALANCES
      // --------------------------------------

  const formattedBalances: Balance[] =
  balances
    .map((balance) => {

      console.log("BALANCE SUPABASE:", balance);

      const playerA =
        playerNames.get(
          balance.player_a
        );

      const playerB =
        playerNames.get(
          balance.player_b
        );

      if (!playerA || !playerB) {
        return null;
      }

      return {
        id: balance.id,
        playerA,
        playerB,
        amount: Number(balance.amount),
      };

    })
    .filter(
      (
        balance
      ): balance is Balance =>
        balance !== null
    );

      // --------------------------------------
      // GUARDAR EN EL ESTADO
      // --------------------------------------

      setGame({

        players:
          formattedPlayers,

        balances:
          formattedBalances,

      });

    }


    loadGame();

  }, []);


  // ==========================================
  // MODIFICAR BALANCE
  // ==========================================

  async function modifyBalance(
    playerA: PlayerName,
    playerB: PlayerName,
    amount: number
  ) {

    const supabase =
      createClient();


    // --------------------------------------
    // BUSCAR BALANCE EXISTENTE
    // --------------------------------------

    const currentBalance =
      game.balances.find(
        (balance) =>

          (
            balance.playerA === playerA &&
            balance.playerB === playerB
          )

          ||

          (
            balance.playerA === playerB &&
            balance.playerB === playerA
          )
      );


    if (!currentBalance) {

      console.error(
        "No se encontró el balance entre:",
        playerA,
        playerB
      );

      return;
    }


    // --------------------------------------
    // CALCULAR NUEVO VALOR
    // --------------------------------------

    let newAmount: number;


    if (
      currentBalance.playerA === playerA &&
      currentBalance.playerB === playerB
    ) {

      newAmount =
        currentBalance.amount +
        amount;

    } else {

      newAmount =
        currentBalance.amount -
        amount;

    }


    // --------------------------------------
    // ACTUALIZAR SUPABASE
    // --------------------------------------
const { error } = await supabase
  .from("balances")
  .update({
    amount: newAmount,
  })
  .eq("id", currentBalance.id);

if (error) {
  console.error("Error actualizando balance");
  console.error("Mensaje:", error.message);
  console.error("Detalles:", error.details);
  console.error("Código:", error.code);
  console.error("Hint:", error.hint);

  return;
}

    // --------------------------------------
    // ACTUALIZAR INTERFAZ
    // --------------------------------------

    setGame((currentGame) => {

      const updatedBalances =
        currentGame.balances.map(
          (balance) => {

            if (
              balance.id ===
              currentBalance.id
            ) {

              return {
                ...balance,
                amount: newAmount,
              };

            }

            return balance;

          }
        );


      return {

        ...currentGame,

        balances:
          updatedBalances,

      };

    });


    // --------------------------------------
    // MOSTRAR CONFIRMACIÓN
    // --------------------------------------

    setToast(
      `${playerA} → ${playerB}: S/${Math.abs(amount).toFixed(2)}`
    );

    setModal(null);

  }


  // ==========================================
  // INTERFAZ
  // ==========================================

  return (

    <main className="container">

      <header className="pageHeader">

        <h1>
          Resultados
        </h1>

        <p>
          Balance entre jugadores
        </p>

      </header>


      <PlayerSummary

        players={
          game.players
        }

        balances={
          game.balances
        }

        getTotal={
          getPlayerTotal
        }

      />


      <section className="playerGrid">

        {game.players.map(
          (player) => (

            <PlayerCard

              key={
                player.id
              }

              player={
                player.name
              }

              players={
                game.players
              }

              balances={
                game.balances
              }


              onIncrease={(
                playerA,
                playerB
              ) => {

                setModal({

                  playerA,

                  playerB,

                  type:
                    "increase",

                });

              }}


              onDecrease={(
                playerA,
                playerB
              ) => {

                setModal({

                  playerA,

                  playerB,

                  type:
                    "decrease",

                });

              }}

            />

          )
        )}

      </section>


      {/* ====================================
          MODAL
          ==================================== */}

      {modal && (

        <AmountModal

          playerA={
            modal.playerA
          }

          playerB={
            modal.playerB
          }

          type={
            modal.type
          }

          onClose={() =>
            setModal(null)
          }


          onConfirm={(
            amount
          ) => {

            const finalAmount =
              modal.type ===
              "increase"

                ? amount

                : -amount;


            modifyBalance(

              modal.playerA,

              modal.playerB,

              finalAmount

            );

          }}

        />

      )}


      {/* ====================================
          TOAST
          ==================================== */}

      {toast && (

        <Toast

          message={
            toast
          }

          onClose={() =>
            setToast(null)
          }

        />

      )}

    </main>

  );

}