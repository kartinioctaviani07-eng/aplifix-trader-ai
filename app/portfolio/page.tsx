"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccountSnapshot = {
  initialBalance: number;
  balance: number;
  realizedProfit: number;
  unrealizedProfit: number;
  equity: number;
  totalTrades: number;
  winRate: number;
};

type AccountResponse = {
  success: boolean;
  account: AccountSnapshot;
};

type PerformanceResult = {
  totalTrade: number;
  win: number;
  loss: number;
  breakEven: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  averageLoss: number;
};

type PerformanceResponse = {
  success: boolean;
  performance: PerformanceResult;
};

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
};

type PositionsResponse = {
  success: boolean;
  total: number;
  open: number;
  positions: Position[];
};

type PortfolioData = {
  account: AccountSnapshot;
  performance: PerformanceResult;
  positions: Position[];
};

function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(value);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getProfitClass(value: number): string {
  if (value > 0) {
    return "text-emerald-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-slate-300";
}

export default function PortfolioPage() {
  const [data, setData] =
    useState<PortfolioData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadPortfolio(): Promise<void> {
    try {
      setError(null);

      const [
        accountResponse,
        performanceResponse,
        positionsResponse,
      ] = await Promise.all([
        fetch("/api/ceo-account", {
          cache: "no-store",
        }),
        fetch("/api/performance", {
          cache: "no-store",
        }),
        fetch("/api/positions", {
          cache: "no-store",
        }),
      ]);

      if (
        !accountResponse.ok ||
        !performanceResponse.ok ||
        !positionsResponse.ok
      ) {
        throw new Error(
          "Failed to load portfolio data."
        );
      }

      const accountData =
        (await accountResponse.json()) as AccountResponse;

      const performanceData =
        (await performanceResponse.json()) as PerformanceResponse;

      const positionsData =
        (await positionsResponse.json()) as PositionsResponse;

      setData({
        account: accountData.account,
        performance: performanceData.performance,
        positions: positionsData.positions.filter(
          (position) =>
            position.status === "OPEN"
        ),
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load portfolio.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPortfolio();

    const interval =
      window.setInterval(
        () => {
          void loadPortfolio();
        },
        10_000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

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
            Financial Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Portfolio
          </h1>

          <p className="mt-2 text-slate-400">
            Real-time financial overview of APLIFIX trading operations.
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
            Loading portfolio...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="font-semibold text-red-400">
            Unable to load portfolio
          </p>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadPortfolio();
            }}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm text-slate-500">
                Equity
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {formatIDR(
                  data.account.equity
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Balance + unrealized P/L
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Available Balance
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {formatIDR(
                  data.account.balance
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Realized account balance
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Realized P/L
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${getProfitClass(
                  data.account.realizedProfit
                )}`}
              >
                {data.account.realizedProfit > 0
                  ? "+"
                  : ""}
                {formatIDR(
                  data.account.realizedProfit
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Closed trading results
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Unrealized P/L
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${getProfitClass(
                  data.account.unrealizedProfit
                )}`}
              >
                {data.account.unrealizedProfit > 0
                  ? "+"
                  : ""}
                {formatIDR(
                  data.account.unrealizedProfit
                )}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Open position valuation
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Initial Capital
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {formatIDR(
                  data.account.initialBalance
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Total Trades
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {data.performance.totalTrade}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {data.performance.win} wins ·{" "}
                {data.performance.loss} losses ·{" "}
                {data.performance.breakEven} break even
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-500">
                Win Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {data.performance.winRate.toFixed(
                  2
                )}
                %
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Based on recorded trades
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold text-white">
                Trading Performance
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-sm text-slate-500">
                    Total Profit
                  </span>

                  <span
                    className={`font-semibold ${getProfitClass(
                      data.performance.totalProfit
                    )}`}
                  >
                    {data.performance.totalProfit > 0
                      ? "+"
                      : ""}
                    {formatIDR(
                      data.performance.totalProfit
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-sm text-slate-500">
                    Average Profit
                  </span>

                  <span className="font-semibold text-emerald-400">
                    +
                    {formatIDR(
                      data.performance.averageProfit
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Average Loss
                  </span>

                  <span className="font-semibold text-red-400">
                    {formatIDR(
                      data.performance.averageLoss
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-bold text-white">
                Capital Status
              </h2>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Initial Capital
                  </span>

                  <span className="text-white">
                    {formatIDR(
                      data.account.initialBalance
                    )}
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width:
                        data.account.initialBalance > 0
                          ? `${Math.min(
                              Math.max(
                                (data.account.equity /
                                  data.account.initialBalance) *
                                  100,
                                0
                              ),
                              100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Current Equity
                  </span>

                  <span className="font-semibold text-white">
                    {formatIDR(
                      data.account.equity
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                Active Portfolio Positions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Positions currently contributing to portfolio equity.
              </p>
            </div>

            {data.positions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
                <p className="text-lg font-semibold text-slate-300">
                  Portfolio currently has no open positions
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Available capital is currently not allocated to an active trade.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {data.positions.map(
                  (position) => (
                    <div
                      key={position.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white">
                              {position.symbol}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                position.side === "BUY"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {position.side}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Opened{" "}
                            {formatDate(
                              position.openedAt
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
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
                              Take Profit
                            </p>

                            <p className="mt-1 font-semibold text-emerald-400">
                              {formatPrice(
                                position.takeProfit
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
