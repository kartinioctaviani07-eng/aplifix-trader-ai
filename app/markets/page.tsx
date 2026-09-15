"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type MarketTicker = {
  symbol: string;
  name: string;
  market: "stock" | "forex" | "commodity" | "crypto";
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  timestamp: number;
};

type MarketApiResponse = {
  success: boolean;
  provider?: string;
  data?: MarketTicker;
  message?: string;
};

const symbols = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
];

function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (value >= 1) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getTrend(changePercent: number): "Bullish" | "Bearish" | "Neutral" {
  if (changePercent > 0.25) {
    return "Bullish";
  }

  if (changePercent < -0.25) {
    return "Bearish";
  }

  return "Neutral";
}

function getTrendClass(
  trend: "Bullish" | "Bearish" | "Neutral"
): string {
  if (trend === "Bullish") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (trend === "Bearish") {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return "border-slate-700 bg-slate-800/70 text-slate-400";
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const loadMarkets = useCallback(async () => {
    try {
      setError(null);

      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const response = await fetch(
            `/api/market?symbol=${encodeURIComponent(symbol)}`,
            {
              cache: "no-store",
            }
          );

          const result =
            (await response.json()) as MarketApiResponse;

          if (!response.ok || !result.success || !result.data) {
            throw new Error(
              result.message ??
                `Failed to load ${symbol}`
            );
          }

          return result.data;
        })
      );

      setMarkets(results);
      setLastUpdated(Date.now());
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load market data";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarkets();

    const interval = window.setInterval(() => {
      void loadMarkets();
    }, 10_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadMarkets]);

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Link
        href="/trader"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            Trading Operations
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Markets
          </h1>

          <p className="mt-2 text-slate-400">
            Real-time cryptocurrency market intelligence
            powered by APLIFIX MarketHub.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
          <p className="text-xs text-slate-500">
            Market Provider
          </p>

          <p className="mt-1 font-semibold text-emerald-400">
            ● Binance
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Auto refresh every 10 seconds
          </p>
        </div>
      </div>

      {loading && markets.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-slate-400">
            Loading live market data...
          </p>
        </div>
      ) : null}

      {error && markets.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm font-semibold text-red-400">
            Market data unavailable
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadMarkets()}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      ) : null}

      {markets.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {markets.map((market) => {
              const trend = getTrend(
                market.changePercent
              );

              const positive =
                market.changePercent >= 0;

              return (
                <article
                  key={market.symbol}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">
                          {market.symbol}
                        </h2>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getTrendClass(
                            trend
                          )}`}
                        >
                          {trend}
                        </span>
                      </div>

                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                        {market.market} · Binance
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                      Live
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Current Price
                    </p>

                    <p className="mt-1 text-3xl font-bold text-white">
                      ${formatPrice(market.price)}
                    </p>

                    <p
                      className={`mt-2 text-sm font-semibold ${
                        positive
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {formatPrice(market.change)} (
                      {positive ? "+" : ""}
                      {market.changePercent.toFixed(2)}
                      %)
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Open
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        ${formatPrice(market.open)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        High
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-400">
                        ${formatPrice(market.high)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Low
                      </p>
                      <p className="mt-1 text-sm font-semibold text-red-400">
                        ${formatPrice(market.low)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Volume
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">
                        {formatNumber(market.volume)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                    <p className="text-xs text-slate-600">
                      Market data timestamp
                    </p>

                    <p className="text-xs text-slate-500">
                      {formatTime(market.timestamp)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-500 sm:flex-row">
            <span>
              {markets.length} markets monitored by APLIFIX
            </span>

            <span>
              Last refresh:{" "}
              {lastUpdated
                ? formatTime(lastUpdated)
                : "-"}
            </span>
          </div>
        </>
      ) : null}
    </main>
  );
}
