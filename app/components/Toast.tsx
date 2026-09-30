"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

export default function Toast({
  message,
  onClose,
}: Props) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () =>
      clearTimeout(timer);

  }, [onClose]);

  return (
    <div className="toast">

      <span className="toastIcon">
        ✓
      </span>

      <span>
        {message}
      </span>

    </div>
  );
}