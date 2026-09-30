"use client";

import { useState } from "react";

import type {
  PlayerName,
} from "@/types/game";

interface Props {
  playerA: PlayerName;
  playerB: PlayerName;

  type:
    | "increase"
    | "decrease";

  onClose: () => void;

  onConfirm: (
    amount: number
  ) => void;
}

export default function AmountModal({
  playerA,
  playerB,
  type,
  onClose,
  onConfirm,
}: Props) {

  const [amount, setAmount] =
    useState("");

  const isIncrease =
    type === "increase";

  function confirm() {

    const value = Number(amount);

    if (!value || value <= 0) {
      return;
    }

    onConfirm(value);
  }

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
    >

      <div
        className="modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <h2>
          {isIncrease
            ? "Agregar resultado"
            : "Restar resultado"}
        </h2>

        <p className="modalDescription">

          {playerA}{" "}

          {isIncrease
            ? "gana"
            : "pierde"}

          {" "}frente a{" "}

          {playerB}

        </p>

        <label>
          Monto
        </label>

        <div className="moneyInput">

          <span>S/</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            autoFocus
          />

        </div>

        <div className="modalActions">

          <button
            type="button"
            className="secondaryButton"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="primaryButton"
            onClick={confirm}
          >
            Confirmar
          </button>

        </div>

      </div>

    </div>
  );
}