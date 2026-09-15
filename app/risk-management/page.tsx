"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type RiskAccount = {
  initialBalance: number;
  balance: number;
  equity: number;
  realizedProfit: number;
  unrealizedProfit: number;
};

type RiskPolicy = {
  maxRiskPercent: number;
  maxExposurePercent: number;
  minStopLossPercent: number;
  minRiskReward: number;
};

type PortfolioRisk = {
  openPositions: number;
  exposureAmount: number;
  exposurePercent: number;
  riskAmount: number;
  riskPercent: number;
};

type RiskPosition = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  decisionId?: string;
  openedAt: number;
};

type RiskEngine = {
  status: string;
  protectionStatus:
    | "PROTECTED"
    | "WARNING";
  vetoEnabled: boolean;
};

type RiskResponse = {
  success: boolean;
  account: RiskAccount;
  policy: RiskPolicy;
  portfolio: PortfolioRisk;
  engine: RiskEngine;
  positions: RiskPosition[];
  timestamp: number;
};

function formatIDR(
  value: number
): string {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "id-ID",
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export default function RiskManagementPage() {
  const [data, setData] =
    useState<RiskResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadRisk =
    useCallback(
      async () => {
        try {
          setError(null);

          const response =
            await fetch(
              "/api/risk-management",
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Gagal mengambil data Risk Management."
            );
          }

          const result =
            (await response.json()) as RiskResponse;

          setData(result);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadRisk();

    const interval =
      window.setInterval(
        () => {
          void loadRisk();
        },
        10000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [loadRisk]);

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-[#06110d] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-emerald-900/40 bg-emerald-950/20 p-8">
            <p className="text-sm text-emerald-300">
              Loading Risk Management...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-[#06110d] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl border border-red-900/40 bg-red-950/20 p-8">
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadRisk();
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const protectedSystem =
    data.engine.protectionStatus ===
    "PROTECTED";

  return (
    <main className="min-h-screen bg-[#06110d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              APLIFIX Digital Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Risk Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Risk Manager mengawasi capital,
              exposure, position risk, dan
              memiliki hak veto terhadap
              keputusan trading CEO.
            </p>
          </div>

          <div
            className={`rounded-2xl border px-5 py-3 ${
              protectedSystem
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-amber-500/30 bg-amber-500/10"
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Protection Status
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                protectedSystem
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {protectedSystem
                ? "● PROTECTED"
                : "● WARNING"}
            </p>
          </div>
        </div>

        {/* ENGINE STATUS */}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Risk Engine
            </p>

            <p className="mt-2 text-xl font-bold text-emerald-300">
              ● {data.engine.status}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              CEO Authority
            </p>

            <p className="mt-2 text-xl font-bold">
              BUY / SELL
            </p>

            <p className="mt-1 text-xs text-slate-500">
              CEO mengirim keputusan ke
              Risk Manager.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Risk Veto
            </p>

            <p className="mt-2 text-xl font-bold text-emerald-300">
              {data.engine.vetoEnabled
                ? "ENABLED"
                : "DISABLED"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Trade dapat dihentikan oleh
              Risk Manager.
            </p>
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">
              Account Risk
            </h2>

            <p className="text-xs text-slate-500">
              Kondisi capital aktual APLIFIX.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Equity
              </p>

              <p className="mt-2 text-xl font-bold">
                {formatIDR(
                  data.account.equity
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Available Balance
              </p>

              <p className="mt-2 text-xl font-bold">
                {formatIDR(
                  data.account.balance
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Realized P/L
              </p>

              <p className="mt-2 text-xl font-bold">
                {formatIDR(
                  data.account.realizedProfit
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Unrealized P/L
              </p>

              <p className="mt-2 text-xl font-bold">
                {formatIDR(
                  data.account.unrealizedProfit
                )}
              </p>
            </div>
          </div>
        </section>

        {/* POLICY */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">
              Risk Policy
            </h2>

            <p className="text-xs text-slate-500">
              Batas perlindungan capital yang
              digunakan Risk Manager.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <p className="text-xs text-slate-500">
                Max Risk / Trade
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {data.policy.maxRiskPercent}%
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <p className="text-xs text-slate-500">
                Max Exposure
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {data.policy.maxExposurePercent}%
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <p className="text-xs text-slate-500">
                Min Stop Loss
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {data.policy.minStopLossPercent}%
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <p className="text-xs text-slate-500">
                Min Risk / Reward
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-300">
                1:{data.policy.minRiskReward}
              </p>
            </div>
          </div>
        </section>

        {/* PORTFOLIO RISK */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">
              Portfolio Risk
            </h2>

            <p className="text-xs text-slate-500">
              Exposure dan total risk dari
              posisi yang sedang terbuka.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Open Positions
              </p>

              <p className="mt-2 text-2xl font-bold">
                {data.portfolio.openPositions}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Exposure
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatNumber(
                  data.portfolio.exposurePercent
                )}
                %
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatIDR(
                  data.portfolio.exposureAmount
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs text-slate-500">
                Portfolio Risk
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatNumber(
                  data.portfolio.riskPercent
                )}
                %
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatIDR(
                  data.portfolio.riskAmount
                )}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 ${
                protectedSystem
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-amber-500/30 bg-amber-500/10"
              }`}
            >
              <p className="text-xs text-slate-500">
                Protection
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  protectedSystem
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {protectedSystem
                  ? "SAFE"
                  : "REVIEW"}
              </p>
            </div>
          </div>
        </section>

        {/* OPEN POSITIONS */}
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-semibold">
              Risk-Protected Positions
            </h2>

            <p className="text-xs text-slate-500">
              Posisi yang sedang berada di
              bawah pengawasan Risk Manager.
            </p>
          </div>

          {data.positions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 p-10 text-center">
              <p className="text-sm font-medium text-slate-300">
                Tidak ada posisi terbuka.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Capital saat ini belum memiliki
                exposure market aktif.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-900/70">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Symbol
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Side
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Entry
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Quantity
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Stop Loss
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Take Profit
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.positions.map(
                      (position) => (
                        <tr
                          key={position.id}
                          className="border-b border-slate-900 last:border-0"
                        >
                          <td className="px-5 py-4 font-semibold text-white">
                            {position.symbol}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                                position.side ===
                                "BUY"
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : "bg-red-500/10 text-red-300"
                              }`}
                            >
                              {position.side}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            {formatNumber(
                              position.entryPrice
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            {formatNumber(
                              position.quantity
                            )}
                          </td>

                          <td className="px-5 py-4 text-red-300">
                            {formatNumber(
                              position.stopLoss
                            )}
                          </td>

                          <td className="px-5 py-4 text-emerald-300">
                            {formatNumber(
                              position.takeProfit
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 text-xs text-slate-600">
          Last updated:{" "}
          {new Date(
            data.timestamp
          ).toLocaleString("id-ID")}
        </div>
      </div>
    </main>
  );
}
