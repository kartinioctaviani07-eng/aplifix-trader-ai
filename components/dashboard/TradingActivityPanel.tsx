"use client";

import { useEffect, useState } from "react";

type Position = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  status: "OPEN" | "CLOSED";
  decisionId?: string;
};

type Trade = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  result: "PROFIT" | "LOSS" | "BREAK EVEN";
  openedAt: number;
  closedAt: number;
  decisionId?: string;
};

type Performance = {
  totalTrade?: number;
  win?: number;
  loss?: number;
  breakEven?: number;
  winRate?: number;
  totalProfit?: number;
  averageProfit?: number;
  averageLoss?: number;
};

type AIDecision = {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  reason: string[];
  timestamp: number;
  trend?: string;
  marketCondition?: string;
  entryPrice?: number;
  exitPrice?: number;
  profit?: number;
  duration?: number;
  result?: "PROFIT" | "LOSS" | "BREAK EVEN" | "OPEN";
};

type PositionsResponse = {
  success: boolean;
  positions?: Position[];
};

type TradeHistoryResponse = {
  success: boolean;
  history?: Trade[];
};

type PerformanceResponse = {
  success: boolean;
  performance?: Performance;
};

type AIMemoryResponse = {
  success: boolean;
  history?: AIDecision[];
};

function formatCurrency(value: number): string {
  const sign =
    value < 0
      ? "-"
      : "";

  const absoluteValue =
    Math.abs(value);

  const fixed =
    absoluteValue.toFixed(2);

  const [integerPart, decimalPart] =
    fixed.split(".");

  const formattedInteger =
    integerPart.replace(
      /\\B(?=(\\d{3})+(?!\\d))/g,
      "."
    );

  return `${sign}Rp ${formattedInteger},${decimalPart}`;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(value);
}

function formatDateTime(
  timestamp: number
): string {
  const date = new Date(timestamp);

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year =
    date.getFullYear();

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  const seconds = String(
    date.getSeconds()
  ).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function calculateFloatingProfit(
  position: Position
): number {
  if (position.side === "BUY") {
    return (
      (position.currentPrice - position.entryPrice) *
      position.quantity
    );
  }

  return (
    (position.entryPrice - position.currentPrice) *
    position.quantity
  );
}

function calculateFloatingPercent(
  position: Position
): number {
  if (position.entryPrice <= 0) {
    return 0;
  }

  if (position.side === "BUY") {
    return (
      ((position.currentPrice - position.entryPrice) /
        position.entryPrice) *
      100
    );
  }

  return (
    ((position.entryPrice - position.currentPrice) /
      position.entryPrice) *
    100
  );
}

function formatDuration(
  openedAt: number,
  now: number
): string {
  const elapsed = Math.max(
    0,
    now - openedAt
  );

  const totalMinutes = Math.floor(
    elapsed / 60_000
  );

  const days = Math.floor(
    totalMinutes / 1_440
  );

  const hours = Math.floor(
    (totalMinutes % 1_440) / 60
  );

  const minutes =
    totalMinutes % 60;

  if (days > 0) {
    return `${days}h ${hours}j ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }

  return `${minutes}m`;
}

function getActionClass(
  action: AIDecision["action"]
): string {
  if (action === "BUY") {
    return "text-emerald-400";
  }

  if (action === "SELL") {
    return "text-red-400";
  }

  if (action === "HOLD") {
    return "text-amber-400";
  }

  return "text-slate-400";
}

function getResultClass(
  result?: AIDecision["result"]
): string {
  if (result === "PROFIT") {
    return "text-emerald-400";
  }

  if (result === "LOSS") {
    return "text-red-400";
  }

  if (result === "OPEN") {
    return "text-blue-400";
  }

  return "text-slate-400";
}

export default function TradingActivityPanel() {
  const [positions, setPositions] =
    useState<Position[]>([]);

  const [trades, setTrades] =
    useState<Trade[]>([]);

  const [performance, setPerformance] =
    useState<Performance>({});

  const [aiMemory, setAiMemory] =
    useState<AIDecision[]>([]);

  const [now, setNow] =
    useState(0);

  async function loadData() {
    try {
      const [
        positionsResponse,
        tradesResponse,
        performanceResponse,
        aiMemoryResponse,
      ] = await Promise.all([
        fetch("/api/positions", {
          cache: "no-store",
        }),
        fetch("/api/trade-history", {
          cache: "no-store",
        }),
        fetch("/api/performance", {
          cache: "no-store",
        }),
        fetch("/api/ai-memory", {
          cache: "no-store",
        }),
      ]);

      const [
        positionsData,
        tradesData,
        performanceData,
        aiMemoryData,
      ] = await Promise.all([
        positionsResponse.json() as Promise<PositionsResponse>,
        tradesResponse.json() as Promise<TradeHistoryResponse>,
        performanceResponse.json() as Promise<PerformanceResponse>,
        aiMemoryResponse.json() as Promise<AIMemoryResponse>,
      ]);

      if (positionsData.success) {
        setPositions(
          positionsData.positions ?? []
        );
      }

      if (tradesData.success) {
        setTrades(
          tradesData.history ?? []
        );
      }

      if (performanceData.success) {
        setPerformance(
          performanceData.performance ?? {}
        );
      }

      if (aiMemoryData.success) {
        setAiMemory(
          (aiMemoryData.history ?? []).slice(0, 10)
        );
      }
    } catch (error) {
      console.error(
        "Gagal memuat Trading Activity:",
        error
      );
    }
  }

  useEffect(() => {
    void loadData();

    const dataInterval =
      window.setInterval(() => {
        void loadData();
      }, 10_000);

    const clockInterval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1_000);

    return () => {
      window.clearInterval(
        dataInterval
      );

      window.clearInterval(
        clockInterval
      );
    };
  }, []);

  return (
    <section className="space-y-6">
      {/* OPEN POSITIONS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Open Positions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Posisi paper trading yang sedang aktif
            </p>
          </div>

          <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {positions.filter(
              (position) =>
                position.status === "OPEN"
            ).length}{" "}
            Open
          </div>
        </div>

        {positions.filter(
          (position) =>
            position.status === "OPEN"
        ).length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <p className="text-slate-400">
              Belum ada posisi terbuka.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {positions
              .filter(
                (position) =>
                  position.status === "OPEN"
              )
              .map((position) => {
                const floatingProfit =
                  calculateFloatingProfit(
                    position
                  );

                const floatingPercent =
                  calculateFloatingPercent(
                    position
                  );

                const isProfit =
                  floatingProfit >= 0;

                return (
                  <div
                    key={position.id}
                    className="rounded-xl border border-slate-700 bg-slate-950 p-5"
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">
                          {position.symbol}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            position.side === "BUY"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {position.side}
                        </span>
                      </div>

                      <div
                        className={
                          isProfit
                            ? "text-right text-emerald-400"
                            : "text-right text-red-400"
                        }
                      >
                        <div className="text-lg font-bold">
                          {isProfit ? "+" : ""}
                          {formatCurrency(
                            floatingProfit
                          )}
                        </div>

                        <div className="text-xs">
                          {isProfit ? "+" : ""}
                          {floatingPercent.toFixed(
                            2
                          )}
                          %
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">
                          Entry
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {formatPrice(
                            position.entryPrice
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Current
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {formatPrice(
                            position.currentPrice
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
                          Quantity
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {position.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Dibuka
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {formatDateTime(
                            position.openedAt
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Durasi
                        </p>

                        <p className="mt-1 font-semibold text-white">
                          {
                            now > 0
                              ? formatDuration(
                                  position.openedAt,
                                  now
                                )
                              : "-"
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Decision ID
                        </p>

                        <p className="mt-1 truncate font-mono text-xs text-slate-400">
                          {position.decisionId ??
                            "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* PERFORMANCE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Performance
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Ringkasan hasil paper trading
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Total Trades
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {performance.totalTrade ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Win Rate
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {(performance.winRate ?? 0).toFixed(
                2
              )}
              %
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Winning Trades
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {performance.win ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Losing Trades
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {performance.loss ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">
              Total Profit
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
                (performance.totalProfit ?? 0) >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(
                performance.totalProfit ?? 0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* TRADE JOURNAL */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Trade Journal
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Riwayat transaksi yang sudah ditutup
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {trades.length} trades
          </span>
        </div>

        {trades.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <p className="text-slate-400">
              Belum ada transaksi selesai.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">
                    Pair
                  </th>

                  <th className="px-3 py-3">
                    Side
                  </th>

                  <th className="px-3 py-3">
                    Entry
                  </th>

                  <th className="px-3 py-3">
                    Exit
                  </th>

                  <th className="px-3 py-3">
                    P/L
                  </th>

                  <th className="px-3 py-3">
                    Result
                  </th>

                  <th className="px-3 py-3">
                    Closed
                  </th>
                </tr>
              </thead>

              <tbody>
                {[...trades]
                  .reverse()
                  .slice(0, 20)
                  .map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-slate-800/70"
                    >
                      <td className="px-3 py-4 font-semibold text-white">
                        {trade.symbol}
                      </td>

                      <td
                        className={`px-3 py-4 font-semibold ${
                          trade.side === "BUY"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.side}
                      </td>

                      <td className="px-3 py-4 text-slate-300">
                        {formatPrice(
                          trade.entryPrice
                        )}
                      </td>

                      <td className="px-3 py-4 text-slate-300">
                        {formatPrice(
                          trade.exitPrice
                        )}
                      </td>

                      <td
                        className={`px-3 py-4 font-semibold ${
                          trade.profit >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.profit >= 0
                          ? "+"
                          : ""}
                        {formatCurrency(
                          trade.profit
                        )}
                      </td>

                      <td
                        className={`px-3 py-4 font-semibold ${
                          trade.result ===
                          "PROFIT"
                            ? "text-emerald-400"
                            : trade.result ===
                              "LOSS"
                            ? "text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {trade.result}
                      </td>

                      <td className="px-3 py-4 text-slate-400">
                        {formatDateTime(
                          trade.closedAt
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI DECISION LOG */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              AI Decision Log
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Keputusan AI terbaru dan hasilnya
            </p>
          </div>

          <span className="text-sm text-slate-500">
            10 terbaru
          </span>
        </div>

        {aiMemory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <p className="text-slate-400">
              Belum ada keputusan AI.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {aiMemory.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {item.symbol}
                      </span>

                      <span
                        className={`font-bold ${getActionClass(
                          item.action
                        )}`}
                      >
                        {item.action}
                      </span>

                      {item.result && (
                        <span
                          className={`text-xs font-semibold ${getResultClass(
                            item.result
                          )}`}
                        >
                          {item.result}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Confidence{" "}
                      <span className="font-semibold text-slate-300">
                        {item.confidence}%
                      </span>
                    </p>
                  </div>

                  <span className="text-xs text-slate-500">
                    {formatDateTime(
                      item.timestamp
                    )}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  {item.reason.map(
                    (reason, index) => (
                      <p
                        key={`${item.id}-${index}`}
                        className="text-xs text-slate-400"
                      >
                        • {reason}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
