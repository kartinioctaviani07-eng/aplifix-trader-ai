"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PositionSide = "BUY" | "SELL";
type PositionStatus = "OPEN" | "CLOSED";

type Position = {
  id: string;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  status: PositionStatus;
  decisionId?: string;
};

type PositionsResponse = {
  success: boolean;
  total: number;
  open: number;
  positions: Position[];
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatQuantity(quantity: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(quantity);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function calculateProfit(position: Position): number {
  const priceDifference =
    position.currentPrice - position.entryPrice;

  if (position.side === "SELL") {
    return -priceDifference * position.quantity;
  }

  return priceDifference * position.quantity;
}

function calculateProfitPercent(position: Position): number {
  if (position.entryPrice === 0) {
    return 0;
  }

  const difference =
    position.currentPrice - position.entryPrice;

  const percentage =
    (difference / position.entryPrice) * 100;

  return position.side === "SELL"
    ? -percentage
    : percentage;
}

export default function PositionsPage() {
  const [data, setData] =
    useState<PositionsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadPositions(): Promise<void> {
    try {
      setError(null);

      const response = await fetch(
        "/api/positions",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load positions."
        );
      }

      const result =
        (await response.json()) as PositionsResponse;

      setData(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load positions.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPositions();

    const interval = window.setInterval(
      () => {
        void loadPositions();
      },
      10_000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const positions =
    data?.positions ?? [];

  const openPositions =
    positions.filter(
      (position) =>
        position.status === "OPEN"
    );

  const closedPositions =
    positions.filter(
      (position) =>
        position.status === "CLOSED"
    );

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Link
        href="/trader"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            Trading Operations
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Positions
          </h1>

          <p className="mt-2 text-slate-400">
            Real-time positions from the APLIFIX trading engine.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Auto refresh every 10 seconds
        </div>
      </div>

      {loading && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-slate-400">
            Loading positions...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="font-semibold text-red-400">
            Unable to load positions
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadPositions();
            }}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Total Positions
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {data?.total ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm text-slate-500">
                Open Positions
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {data?.open ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Closed Positions
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {closedPositions.length}
              </p>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                Active Positions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Positions currently managed by the trading engine.
              </p>
            </div>

            {openPositions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
                <p className="text-lg font-semibold text-slate-300">
                  No active positions
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  APLIFIX currently has no open trading position.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {openPositions.map(
                  (position) => {
                    const profit =
                      calculateProfit(
                        position
                      );

                    const profitPercent =
                      calculateProfitPercent(
                        position
                      );

                    const isProfit =
                      profit >= 0;

                    return (
                      <article
                        key={position.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-white">
                                {position.symbol}
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  position.side ===
                                  "BUY"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {position.side}
                              </span>

                              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                OPEN
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                              Opened{" "}
                              {formatDate(
                                position.openedAt
                              )}
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-sm text-slate-500">
                              Unrealized P/L
                            </p>

                            <p
                              className={`mt-1 text-2xl font-bold ${
                                isProfit
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {isProfit
                                ? "+"
                                : "-"}
                              {formatPrice(
                                Math.abs(
                                  profit
                                )
                              )}
                            </p>

                            <p
                              className={`text-sm ${
                                isProfit
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {isProfit
                                ? "+"
                                : ""}
                              {profitPercent.toFixed(
                                2
                              )}
                              %
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-500">
                              Entry Price
                            </p>

                            <p className="mt-1 font-semibold text-white">
                              {formatPrice(
                                position.entryPrice
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Current Price
                            </p>

                            <p className="mt-1 font-semibold text-white">
                              {formatPrice(
                                position.currentPrice
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Quantity
                            </p>

                            <p className="mt-1 font-semibold text-white">
                              {formatQuantity(
                                position.quantity
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Stop Loss
                            </p>

                            <p className="mt-1 font-semibold text-red-400">
                              {formatPrice(
                                position.stopLoss
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Take Profit
                            </p>

                            <p className="mt-1 font-semibold text-emerald-400">
                              {formatPrice(
                                position.takeProfit
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Decision ID
                            </p>

                            <p className="mt-1 truncate font-mono text-xs text-slate-400">
                              {position.decisionId ??
                                "—"}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {closedPositions.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-white">
                Position History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Previously closed positions.
              </p>

              <div className="mt-4 space-y-3">
                {closedPositions.map(
                  (position) => (
                    <div
                      key={position.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <p className="font-semibold text-white">
                            {position.symbol}
                          </p>

                          <p className="text-xs text-slate-500">
                            {position.side} ·{" "}
                            {formatDate(
                              position.openedAt
                            )}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                          CLOSED
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
