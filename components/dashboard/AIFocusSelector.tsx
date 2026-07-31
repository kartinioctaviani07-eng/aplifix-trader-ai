"use client";

import {
  useState,
} from "react";

import Card from "@/components/ui/Card";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "SUIUSDT",
];

export default function AIFocusSelector() {

  const [mode, setMode] =
    useState<"AUTO" | "MANUAL">("AUTO");

  const [symbol, setSymbol] =
    useState("BTCUSDT");

  const [status, setStatus] =
    useState("");

  async function applyFocus() {

    try {

      setStatus(
        "AI sedang memproses..."
      );

      const url =
        mode === "AUTO"
          ? "/api/ai-focus?mode=AUTO"
          : `/api/ai-focus?mode=MANUAL&symbol=${symbol}`;

      const response =
        await fetch(
          url,
          {
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (result.success) {

        setStatus(
          `${result.mode}: ${result.focus?.symbol ?? "-"}`
        );

      } else {

        setStatus(
          "Gagal mengambil focus"
        );

      }

    } catch {

      setStatus(
        "Error koneksi AI"
      );

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
              onClick={() => setMode("AUTO")}
              className={
                mode === "AUTO"
                  ? "rounded-lg bg-emerald-600 px-4 py-2 text-white"
                  : "rounded-lg bg-slate-800 px-4 py-2 text-white"
              }
            >
              AUTO CEO
            </button>

            <button
              onClick={() => setMode("MANUAL")}
              className={
                mode === "MANUAL"
                  ? "rounded-lg bg-emerald-600 px-4 py-2 text-white"
                  : "rounded-lg bg-slate-800 px-4 py-2 text-white"
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
              onChange={(e) =>
                setSymbol(e.target.value)
              }
              className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white"
            >

              {SYMBOLS.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

        )}

        <button
          onClick={applyFocus}
          className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white"
        >
          APPLY AI FOCUS
        </button>

        <p className="text-sm text-emerald-400">
          {status}
        </p>

      </div>

    </Card>

  );

}
