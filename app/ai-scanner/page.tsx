"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

type MarketScanResult = {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
  technicalScore: number;
  consensusScore: number;
  sentimentScore: number;
  fundamentalScore: number;
  macroScore: number;
  riskScore: number;
  trend: string;
  action: string;
  confidence: number;
  reason: string[];
};

type ScannerResponse = {
  success: boolean;
  total: number;
  bestMarket: MarketScanResult | null;
  markets: MarketScanResult[];
  updatedAt: number;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(price);
}

function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  }

  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }

  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }

  return volume.toFixed(0);
}

function actionClass(action: string): string {
  if (action === "BUY") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }

  if (action === "SELL") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }

  if (action === "HOLD") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  }

  return "border-slate-600 bg-slate-800/70 text-slate-300";
}

function trendClass(trend: string): string {
  if (trend === "Bullish") {
    return "text-emerald-400";
  }

  if (trend === "Bearish") {
    return "text-red-400";
  }

  return "text-slate-300";
}

function scoreWidth(score: number): string {
  return `${Math.max(0, Math.min(100, score))}%`;
}

export default function AIScannerPage() {
  const [data, setData] =
    useState<ScannerResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadScanner =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await fetch(
            "/api/market-scanner",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load AI scanner"
          );
        }

        const result =
          (await response.json()) as ScannerResponse;

        setData(result);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load AI scanner"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadScanner();

    const interval =
      window.setInterval(
        () => {
          void loadScanner();
        },
        30_000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [loadScanner]);

  const bestMarket =
    data?.bestMarket ?? null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/trader"
          className="mb-6 inline-flex rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              🕵️ AI Market Scanner
            </h1>

            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Intelligence Active
            </span>
          </div>

          <p className="mt-2 max-w-3xl text-slate-400">
            APLIFIX Market Intelligence scans multiple
            markets and ranks opportunities using the
            complete AI Brain.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => {
                  void loadScanner();
                }}
                className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {bestMarket && (
          <section className="mb-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  🏆 Best Market Opportunity
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {bestMarket.symbol}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Ranked by APLIFIX AI confidence
                  and decision score.
                </p>
              </div>

              <div
                className={`rounded-xl border px-5 py-3 text-center ${actionClass(
                  bestMarket.action
                )}`}
              >
                <p className="text-xs uppercase tracking-wider opacity-70">
                  CEO Signal
                </p>

                <p className="mt-1 text-2xl font-black">
                  {bestMarket.action}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">
                  AI Score
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  {bestMarket.score}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">
                  Confidence
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {bestMarket.confidence}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">
                  Trend
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${trendClass(
                    bestMarket.trend
                  )}`}
                >
                  {bestMarket.trend}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-500">
                  Price
                </p>
                <p className="mt-1 text-2xl font-bold">
                  ${formatPrice(bestMarket.price)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                CEO Intelligence
              </p>

              <ul className="space-y-1 text-sm text-slate-300">
                {bestMarket.reason
                  .slice(0, 4)
                  .map((reason, index) => (
                    <li key={`${reason}-${index}`}>
                      ✓ {reason}
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Markets Scanned
            </p>
            <p className="mt-2 text-3xl font-bold">
              {data?.total ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Bullish
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {data?.markets.filter(
                (market) =>
                  market.trend === "Bullish"
              ).length ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Watch
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {data?.markets.filter(
                (market) =>
                  market.action === "HOLD"
              ).length ?? 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Last Scan
            </p>
            <p className="mt-2 text-xl font-bold">
              {data
                ? new Date(
                    data.updatedAt
                  ).toLocaleTimeString(
                    "id-ID"
                  )
                : "--:--:--"}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Market Intelligence Ranking
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sorted by AI confidence and
                decision score.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              Auto refresh: 30s
            </span>
          </div>

          {loading && !data ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
              APLIFIX AI sedang melakukan market scan...
            </div>
          ) : (
            <div className="space-y-4">
              {data?.markets.map(
                (market, index) => (
                  <article
                    key={market.symbol}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-400">
                          #{index + 1}
                        </div>

                        <div>
                          <h3 className="text-lg font-bold">
                            {market.symbol}
                          </h3>

                          <p className="text-xs text-slate-500">
                            ${formatPrice(
                              market.price
                            )}{" "}
                            · 24h{" "}
                            {market.change24h >= 0
                              ? "+"
                              : ""}
                            {market.change24h.toFixed(
                              2
                            )}
                            %
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${actionClass(
                            market.action
                          )}`}
                        >
                          {market.action}
                        </span>

                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            Confidence
                          </p>
                          <p className="font-bold">
                            {market.confidence}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-6">
                      {[
                        [
                          "AI Score",
                          market.score,
                        ],
                        [
                          "Technical",
                          market.technicalScore,
                        ],
                        [
                          "Consensus",
                          market.consensusScore,
                        ],
                        [
                          "Sentiment",
                          market.sentimentScore,
                        ],
                        [
                          "Fundamental",
                          market.fundamentalScore,
                        ],
                        [
                          "Risk",
                          market.riskScore,
                        ],
                      ].map(
                        ([label, score]) => (
                          <div
                            key={label}
                            className="rounded-lg bg-slate-950/60 p-3"
                          >
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">
                                {label}
                              </span>

                              <span className="font-semibold text-slate-300">
                                {score}
                              </span>
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-500/70"
                                style={{
                                  width:
                                    scoreWidth(
                                      Number(score)
                                    ),
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500">
                      <span>
                        Trend:{" "}
                        <strong
                          className={trendClass(
                            market.trend
                          )}
                        >
                          {market.trend}
                        </strong>
                      </span>

                      <span>
                        Volume:{" "}
                        {formatVolume(
                          market.volume
                        )}
                      </span>

                      <span>
                        Macro: {market.macroScore}
                      </span>

                      <span>
                        Fundamental:{" "}
                        {market.fundamentalScore}
                      </span>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
