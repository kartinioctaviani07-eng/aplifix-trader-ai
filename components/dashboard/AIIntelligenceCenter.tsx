"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type MarketOpportunity = {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  score: number;
  trend: string;
  risk: string;
};

type MarketIntelligenceResponse = {
  success: boolean;
  data?: {
    opportunities: MarketOpportunity[];
    best: MarketOpportunity;
    generatedAt: number;
  };
  message?: string;
};

function trendClass(trend: string): string {
  if (trend === "Bullish") {
    return "text-emerald-400";
  }

  if (trend === "Bearish") {
    return "text-red-400";
  }

  return "text-slate-300";
}

function riskClass(risk: string): string {
  if (risk === "LOW") {
    return "text-emerald-400";
  }

  if (risk === "MEDIUM") {
    return "text-yellow-400";
  }

  return "text-red-400";
}

export default function AIIntelligenceCenter() {
  const [data, setData] =
    useState<MarketIntelligenceResponse["data"]>();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadIntelligence() {
      try {
        const response =
          await fetch(
            "/api/market-intelligence",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil data market intelligence."
          );
        }

        const result =
          (await response.json()) as MarketIntelligenceResponse;

        if (!result.success || !result.data) {
          throw new Error(
            result.message ??
              "Data intelligence tidak tersedia."
          );
        }

        if (active) {
          setData(result.data);
          setError(null);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Terjadi kesalahan saat membaca intelligence."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadIntelligence();

    const interval =
      window.setInterval(
        () => {
          void loadIntelligence();
        },
        30000
      );

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <Card title="🕵️ APLIFIX Intelligence Center">
        <p className="text-slate-400">
          Intelligence Division sedang
          menganalisis market...
        </p>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card title="🕵️ APLIFIX Intelligence Center">
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">
            {error ??
              "Data intelligence tidak tersedia."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="🕵️ APLIFIX Intelligence Center">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Market Intelligence Division
            </p>
            <p className="mt-1 text-xs text-slate-500">
              AI sedang membandingkan{" "}
              {data.opportunities.length} market
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Intelligence Active
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  ⭐
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  AI Focus
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {data.best.symbol}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Market dengan confidence
                tertinggi saat ini.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">
                  Decision
                </p>
                <div className="mt-2">
                  <Badge
                    text={data.best.action}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">
                  Confidence
                </p>
                <p className="mt-2 font-bold text-emerald-400">
                  {data.best.confidence}%
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">
                  Score
                </p>
                <p className="mt-2 font-bold text-cyan-400">
                  {data.best.score}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-3">
                <p className="text-xs text-slate-500">
                  Risk
                </p>
                <p
                  className={`mt-2 font-bold ${riskClass(
                    data.best.risk
                  )}`}
                >
                  {data.best.risk}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              Market Intelligence
            </p>

            <p className="text-xs text-slate-500">
              Live analysis
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">
                    Market
                  </th>
                  <th className="px-4 py-3">
                    Decision
                  </th>
                  <th className="px-4 py-3">
                    Confidence
                  </th>
                  <th className="px-4 py-3">
                    Score
                  </th>
                  <th className="px-4 py-3">
                    Trend
                  </th>
                  <th className="px-4 py-3">
                    Risk
                  </th>
                  <th className="px-4 py-3 text-right">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.opportunities.map(
                  (market) => {
                    const isBest =
                      market.symbol ===
                      data.best.symbol;

                    return (
                      <tr
                        key={market.symbol}
                        className="border-b border-slate-800/70 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {isBest && (
                              <span
                                className="text-amber-400"
                                title="AI Focus"
                              >
                                ⭐
                              </span>
                            )}

                            <span className="font-semibold text-white">
                              {market.symbol}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            text={market.action}
                          />
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-200">
                          {market.confidence}%
                        </td>

                        <td className="px-4 py-4 font-semibold text-cyan-400">
                          {market.score}
                        </td>

                        <td
                          className={`px-4 py-4 font-medium ${trendClass(
                            market.trend
                          )}`}
                        >
                          {market.trend}
                        </td>

                        <td
                          className={`px-4 py-4 font-medium ${riskClass(
                            market.risk
                          )}`}
                        >
                          {market.risk}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {isBest ? (
                            <span className="text-xs font-semibold text-amber-400">
                              AI FOCUS
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">
                              Monitored
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Intelligence refresh setiap 30 detik
            </span>

            <span>
              Last scan:{" "}
              {new Date(
                data.generatedAt
              ).toLocaleTimeString(
                "id-ID"
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
