"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";

import { useAIFocus } from "@/context/AIFocusContext";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "SUIUSDT",
];

export default function AIFocusSelector() {
  const {
    focus,
    setManualFocus,
    setAutoFocus,
  } = useAIFocus();

  const [mode, setMode] =
    useState<"AUTO" | "MANUAL">("AUTO");

  const [symbol, setSymbol] =
    useState("BTCUSDT");

  const [status, setStatus] =
    useState("");

  const [applying, setApplying] =
    useState(false);

  async function applyFocus() {
    if (applying) {
      return;
    }

    setApplying(true);

    setStatus(
      "AI sedang memproses..."
    );

    try {
      if (mode === "MANUAL") {
        await setManualFocus(symbol);

        setStatus(
          `MANUAL: ${symbol}`
        );

        return;
      }

      await setAutoFocus();

      setStatus(
        "AUTO: AI sedang memilih market terbaik"
      );
    } catch (error) {
      console.error(
        "Apply AI Focus:",
        error
      );

      setStatus(
        "Error koneksi AI"
      );
    } finally {
      setApplying(false);
    }
  }

  return (
    <Card title="🤖 AI Focus Control">
      <div className="space-y-5">

        <div>
          <p className="text-sm text-slate-400">
            Mode AI
          </p>

          <div className="mt-2 flex gap-3">

            <button
              type="button"
              onClick={() =>
                setMode("AUTO")
              }
              disabled={applying}
              className={
                mode === "AUTO"
                  ? "rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  : "rounded-lg bg-slate-800 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              AUTO CEO
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("MANUAL")
              }
              disabled={applying}
              className={
                mode === "MANUAL"
                  ? "rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  : "rounded-lg bg-slate-800 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              MANUAL
            </button>

          </div>
        </div>

        {mode === "MANUAL" && (
          <div>

            <p className="text-sm text-slate-400">
              Pilih Market
            </p>

            <select
              value={symbol}
              onChange={(event) =>
                setSymbol(
                  event.target.value
                )
              }
              disabled={applying}
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {SYMBOLS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

          </div>
        )}

        <button
          type="button"
          onClick={applyFocus}
          disabled={applying}
          className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {applying
            ? "MEMPROSES..."
            : "APPLY AI FOCUS"}
        </button>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">

          <p className="text-xs text-slate-500">
            AI Focus Saat Ini
          </p>

          <p className="mt-1 text-lg font-bold text-emerald-400">
            {focus?.symbol ?? "-"}
          </p>

        </div>

        <p className="min-h-5 text-sm text-emerald-400">
          {status}
        </p>

      </div>
    </Card>
  );
}
