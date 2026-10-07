"use client";

import { useState } from "react";

import type { Card } from "@/lib/poker/cards";

import {
  calculateEquity,
  type EquityResult,
} from "@/lib/poker/equity";
import CardSelector from "./components/CardSelector";

export default function CalculadoraPage() {
  const [hero, setHero] =
    useState<Card[]>([]);

  const [villain, setVillain] =
    useState<Card[]>([]);

  const [board, setBoard] =
    useState<Card[]>([]);

  const [result, setResult] =
    useState<EquityResult | null>(
      null
    );

  function calculate() {
    if (
      hero.length !== 2 ||
      villain.length !== 2
    ) {
      return;
    }

    const equity =
      calculateEquity(
        hero,
        villain,
        board
      );

    setResult(equity);
  }

  function reset() {
    setHero([]);
    setVillain([]);
    setBoard([]);
    setResult(null);
  }

  return (
    <main className="calculatorContainer">
      <header className="pageHeader">
        <h1>
          Calculadora de Equity
        </h1>

        <p>
          Calcula la equity exacta
          de una mano de Texas
          Hold'em.
        </p>
      </header>

      <section className="calculatorSection">
        <h2>Tu mano</h2>

        <CardSelector
          cards={hero}
          maxCards={2}
          onChange={setHero}
        />
      </section>

      <section className="calculatorSection">
        <h2>Mano rival</h2>

        <CardSelector
          cards={villain}
          maxCards={2}
          onChange={setVillain}
        />
      </section>

      <section className="calculatorSection">
        <h2>Board</h2>

        <CardSelector
          cards={board}
          maxCards={5}
          onChange={setBoard}
        />
      </section>

      <div className="calculatorActions">
        <button
          onClick={calculate}
          disabled={
            hero.length !== 2 ||
            villain.length !== 2
          }
          className="calculateButton"
        >
          Calcular Equity
        </button>

        <button
          onClick={reset}
          className="resetButton"
        >
          Limpiar
        </button>
      </div>

      {result && (
        <section className="equityResult">
          <h2>Resultado</h2>

          <div className="equityNumbers">
            <div>
              <span>Hero</span>
              <strong>
                {result.heroEquity.toFixed(
                  2
                )}
                %
              </strong>
            </div>

            <div>
              <span>Villain</span>
              <strong>
                {result.villainEquity.toFixed(
                  2
                )}
                %
              </strong>
            </div>
          </div>

          <p>
            Empates: {result.ties}
          </p>

          <p>
            Escenarios analizados:{" "}
            {result.total}
          </p>
        </section>
      )}
    </main>
  );
}