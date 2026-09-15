"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import MemberMarketChart from "@/components/member/MemberMarketChart";

type MarketData = {
  symbol: string;
  price: number;
  change24h: number;
};

type MarketResponse = {
  success: boolean;
  data?: {
    symbol?: string;
    price?: number;
    change24h?: number;
    changePercent24h?: number;
  };
};

type DemoDecision = {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  totalScore: number;
  price: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  trend: string;
  reasons: string[];
  executed: boolean;
  reason?: string;
};

type DemoRunData = {
  monitored: {
    updated: number;
    closed: number;
  };
  analyzed: number;
  executed: number;
  decisions: DemoDecision[];
};

type DemoApiResponse = {
  success: boolean;
  message?: string;
  data?: DemoRunData;
};

type DemoAccount = {
  id: string;
  initialBalance: number;
  balance: number;
  equity: number;
  totalPnl: number;
  realizedPnl: number;
  unrealizedPnl: number;
  createdAt: number;
};

type DemoPosition = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  status: "OPEN";
  openedAt: number;
  updatedAt: number;
};

type DemoTrade = {
  id: string;
  positionId: string | null;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  realizedPnl: number;
  type: "OPEN" | "CLOSE";
  createdAt: number;
};

type AIActivity = {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  totalScore: number;
  price: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  trend: string;
  reasons: string[];
  executionStatus:
    | "EXECUTED"
    | "NOT_EXECUTED"
    | "REJECTED";
  executionReason: string;
  decisionId: string;
  createdAt: number;
};

type DemoStatusData = {
  account: DemoAccount;
  positions: DemoPosition[];
  trades: DemoTrade[];
  aiActivity: AIActivity[];
  monitored: {
    updated: number;
    closed: number;
  };
  timestamp: number;
};

type DemoStatusResponse = {
  success: boolean;
  message?: string;
  data?: DemoStatusData;
};

const MARKETS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
] as const;

function formatRupiah(
  amount: number,
): string {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function formatPrice(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function formatPercent(
  value: number,
): string {
  const prefix =
    value >= 0 ? "+" : "";

  return `${prefix}${value.toFixed(2)}%`;
}

function formatQuantity(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 8,
    },
  ).format(value);
}

function formatTime(
  timestamp: number,
): string {
  return new Date(timestamp)
    .toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    );
}

function getActionClass(
  action: DemoDecision["action"],
): string {
  if (action === "BUY") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (action === "SELL") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  if (action === "HOLD") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-slate-700 bg-slate-800 text-slate-300";
}

export default function MemberTraderPage() {
  const [selectedSymbol, setSelectedSymbol] =
    useState<string>("BTCUSDT");

  const [markets, setMarkets] =
    useState<MarketData[]>([]);

  const [account, setAccount] =
    useState<DemoAccount | null>(null);

  const [positions, setPositions] =
    useState<DemoPosition[]>([]);

  const [trades, setTrades] =
    useState<DemoTrade[]>([]);

  const [aiActivities, setAiActivities] =
    useState<AIActivity[]>([]);
  const [demoResult, setDemoResult] =
    useState<DemoRunData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [runningDemo, setRunningDemo] =
    useState(false);

  const [aiActivity, setAiActivity] =
    useState<string>("READY");
  const [demoActive, setDemoActive] =
    useState(false);
  const demoActiveRef =
    useRef(false);

  const feedRevealTimerRef =
    useRef<number | null>(null);

  const feedInitializedRef =
    useRef(false);

  const displayedActivityIdsRef =
    useRef<Set<string>>(new Set());

  const pendingActivitiesRef =
    useRef<AIActivity[]>([]);

  const [error, setError] =
    useState("");

  const [demoError, setDemoError] =
    useState("");

  async function loadMarkets(): Promise<void> {
    try {
      const results =
        await Promise.all(
          MARKETS.map(
            async (
              symbol,
            ): Promise<MarketData | null> => {
              const response =
                await fetch(
                  `/api/market?symbol=${encodeURIComponent(symbol)}`,
                  {
                    cache: "no-store",
                  },
                );

              if (!response.ok) {
                return null;
              }

              const payload =
                (await response.json()) as MarketResponse;

              if (
                !payload.success ||
                !payload.data?.symbol ||
                typeof payload.data.price !==
                  "number"
              ) {
                return null;
              }

              const change =
                typeof payload.data
                  .changePercent24h ===
                "number"
                  ? payload.data
                      .changePercent24h
                  : typeof payload.data
                        .change24h ===
                      "number"
                    ? payload.data
                        .change24h
                    : 0;

              return {
                symbol:
                  payload.data.symbol,
                price:
                  payload.data.price,
                change24h: change,
              };
            },
          ),
        );

      setMarkets(
        results.filter(
          (
            market,
          ): market is MarketData =>
            market !== null,
        ),
      );
    } catch {
      setError(
        "Gagal mengambil data market.",
      );
    }
  }

  async function loadDemoStatus(): Promise<void> {
    try {
      const response =
        await fetch(
          "/api/member/demo/status",
          {
            cache: "no-store",
          },
        );

      const payload =
        (await response.json()) as DemoStatusResponse;

      if (response.status === 401) {
        window.location.href =
          "/member/login";
        return;
      }

      if (
        !response.ok ||
        !payload.success ||
        !payload.data
      ) {
        throw new Error(
          payload.message ??
            "Gagal mengambil Demo Account.",
        );
      }

      setAccount(
        payload.data.account,
      );

      setPositions(
        payload.data.positions,
      );

      setTrades(
        payload.data.trades,
      );

      const latestActivities =
        payload.data.aiActivity;

      if (!feedInitializedRef.current) {
        const initialActivities = [
          ...latestActivities,
        ].sort(
          (a, b) => b.createdAt - a.createdAt,
        );

        displayedActivityIdsRef.current = new Set(
          initialActivities.map(
            (activity) => activity.id,
          ),
        );

        setAiActivities(initialActivities);

        feedInitializedRef.current = true;
        return;
      }

      const newActivities =
        latestActivities.filter(
          (activity) =>
            !displayedActivityIdsRef.current.has(
              activity.id,
            ) &&
            !pendingActivitiesRef.current.some(
              (pending) =>
                pending.id === activity.id,
            ),
        );

      if (newActivities.length > 0) {
        const shuffledActivities = [
          ...newActivities,
        ];

        for (
          let index =
            shuffledActivities.length - 1;
          index > 0;
          index -= 1
        ) {
          const randomIndex = Math.floor(
            Math.random() * (index + 1),
          );

          [
            shuffledActivities[index],
            shuffledActivities[randomIndex],
          ] = [
            shuffledActivities[randomIndex],
            shuffledActivities[index],
          ];
        }

        const currentTopSymbol =
          aiActivities[0]?.symbol;

        if (
          currentTopSymbol &&
          shuffledActivities.length > 1 &&
          shuffledActivities[0].symbol ===
            currentTopSymbol
        ) {
          const differentIndex =
            shuffledActivities.findIndex(
              (activity) =>
                activity.symbol !==
                currentTopSymbol,
            );

          if (differentIndex > 0) {
            [
              shuffledActivities[0],
              shuffledActivities[differentIndex],
            ] = [
              shuffledActivities[differentIndex],
              shuffledActivities[0],
            ];
          }
        }

        pendingActivitiesRef.current.push(
          ...shuffledActivities,
        );
      }

      if (
        feedRevealTimerRef.current === null &&
        pendingActivitiesRef.current.length > 0
      ) {
        const revealNextActivity = (): void => {
          const nextActivity =
            pendingActivitiesRef.current.shift();

          if (!nextActivity) {
            feedRevealTimerRef.current = null;
            return;
          }

          displayedActivityIdsRef.current.add(
            nextActivity.id,
          );

          setAiActivities(
            (currentActivities) => [
              nextActivity,
              ...currentActivities.filter(
                (activity) =>
                  activity.id !==
                  nextActivity.id,
              ),
            ],
          );

          if (
            pendingActivitiesRef.current.length >
            0
          ) {
            const delay =
              2500 +
              Math.floor(
                Math.random() * 2001,
              );

            feedRevealTimerRef.current =
              window.setTimeout(
                revealNextActivity,
                delay,
              );
          } else {
            feedRevealTimerRef.current = null;
          }
        };

        revealNextActivity();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil Demo Account.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMarkets();
    void loadDemoStatus();

    const marketTimer =
      window.setInterval(
        () => {
          void loadMarkets();
        },
        15000,
      );

    const accountTimer =
      window.setInterval(
        () => {
          void loadDemoStatus();
        },
        5000,
      );

    return () => {
      window.clearInterval(
        marketTimer,
      );

      window.clearInterval(
        accountTimer,
      );

      if (
        feedRevealTimerRef.current !== null
      ) {
        window.clearTimeout(
          feedRevealTimerRef.current,
        );

        feedRevealTimerRef.current = null;
      }

      pendingActivitiesRef.current = [];
    };
  }, []);

  const demoCycleTimerRef =
    useRef<number | null>(null);

  async function runDemoAICycle(): Promise<void> {
    if (!demoActiveRef.current || runningDemo) {
      return;
    }

    try {
      setRunningDemo(true);
      setDemoError("");
      setAiActivity("CONNECTING");

      await new Promise((resolve) =>
        window.setTimeout(resolve, 350),
      );

      if (!demoActiveRef.current) {
        return;
      }

      setAiActivity("SCANNING MARKETS");

      await new Promise((resolve) =>
        window.setTimeout(resolve, 700),
      );

      if (!demoActiveRef.current) {
        return;
      }

      setAiActivity("ANALYZING");

      await new Promise((resolve) =>
        window.setTimeout(resolve, 900),
      );

      if (!demoActiveRef.current) {
        return;
      }

      setAiActivity("RISK CHECK");

      const response =
        await fetch(
          "/api/member/demo/run",
          {
            method: "POST",
            cache: "no-store",
          },
        );

      if (response.status === 401) {
        window.location.href =
          "/member/login";
        return;
      }

      const payload =
        (await response.json()) as DemoApiResponse;

      if (
        !response.ok ||
        !payload.success ||
        !payload.data
      ) {
        throw new Error(
          payload.message ??
            "Demo AI gagal dijalankan.",
        );
      }

      if (!demoActiveRef.current) {
        return;
      }

      setAiActivity("FINALIZING");
      setDemoResult(
        payload.data,
      );

      await loadDemoStatus();

      if (demoActiveRef.current) {
        setAiActivity("COMPLETE");
      }
    } catch (error) {
      setAiActivity("ERROR");

      setDemoError(
        error instanceof Error
          ? error.message
          : "Gagal menjalankan Demo AI.",
      );
    } finally {
      setRunningDemo(false);

      if (demoActiveRef.current) {
        demoCycleTimerRef.current =
          window.setTimeout(() => {
            if (demoActiveRef.current) {
              void runDemoAICycle();
            }
          }, 20000);
      }
    }
  }

  function startDemoAI(): void {
    if (demoActiveRef.current) {
      return;
    }

    if (demoCycleTimerRef.current !== null) {
      window.clearTimeout(
        demoCycleTimerRef.current,
      );
      demoCycleTimerRef.current = null;
    }

    demoActiveRef.current = true;
    setDemoActive(true);
    setDemoError("");
    setAiActivity("STARTING");

    void runDemoAICycle();
  }

  function stopDemoAI(): void {
    demoActiveRef.current = false;
    setDemoActive(false);
    setAiActivity("STOPPED");
    setDemoError("");

    if (demoCycleTimerRef.current !== null) {
      window.clearTimeout(
        demoCycleTimerRef.current,
      );
      demoCycleTimerRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      demoActiveRef.current = false;

      if (demoCycleTimerRef.current !== null) {
        window.clearTimeout(
          demoCycleTimerRef.current,
        );
        demoCycleTimerRef.current = null;
      }
    };
  }, []);



  const totalPnl =
    account?.totalPnl ?? 0;

  const pnlPositive =
    totalPnl >= 0;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <Link
              href="/member/dashboard"
              className="text-sm font-medium text-slate-500 transition hover:text-emerald-400"
            >
              ← Member Dashboard
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                APLIFIX MEMBER
              </p>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-300">
                DEMO ONLY
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trader AI Terminal
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              AI Worker memindai market,
              mengambil keputusan, dan
              mengelola Demo Account secara
              otomatis.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              AI Worker
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <span className="text-sm font-semibold text-emerald-300">
                ONLINE
              </span>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Demo Balance
            </p>
            <p className="mt-2 text-xl font-bold">
              {account
                ? formatRupiah(
                    account.balance,
                  )
                : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Equity
            </p>
            <p className="mt-2 text-xl font-bold">
              {account
                ? formatRupiah(
                    account.equity,
                  )
                : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Total P&L
            </p>
            <p
              className={`mt-2 text-xl font-bold ${
                pnlPositive
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {account
                ? formatRupiah(
                    account.totalPnl,
                  )
                : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Realized P&L
            </p>
            <p
              className={`mt-2 text-xl font-bold ${
                (account?.realizedPnl ??
                  0) >= 0
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {account
                ? formatRupiah(
                    account.realizedPnl,
                  )
                : "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-600">
              Open Positions
            </p>
            <p className="mt-2 text-xl font-bold">
              {positions.length}
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-2">
          <div className="flex min-w-max gap-2">
            {MARKETS.map(
              (symbol) => {
                const market =
                  markets.find(
                    (item) =>
                      item.symbol ===
                      symbol,
                  );

                const active =
                  selectedSymbol ===
                  symbol;

                return (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() =>
                      setSelectedSymbol(
                        symbol,
                      )
                    }
                    className={`rounded-xl px-5 py-3 text-left transition ${
                      active
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    <p className="text-xs font-bold">
                      {symbol.replace(
                        "USDT",
                        "",
                      )}
                    </p>

                    <p className="mt-1 text-xs">
                      {market
                        ? `$${formatPrice(
                            market.price,
                          )}`
                        : "--"}
                    </p>
                  </button>
                );
              },
            )}
          </div>
        </section>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <MemberMarketChart
            symbol={selectedSymbol}
          />

          <aside className="rounded-3xl border border-amber-400/20 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                  AI WORKER
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Market Scanner
                </h2>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                ACTIVE
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              AI memindai 5 market,
              mengevaluasi confidence dan
              risiko, kemudian hanya membuka
              posisi jika kriteria terpenuhi.
            </p>
            <div className="mt-5 rounded-2xl border border-amber-400/10 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      runningDemo
                        ? "animate-pulse bg-amber-300"
                        : aiActivity === "COMPLETE"
                          ? "bg-emerald-400"
                          : aiActivity === "ERROR"
                            ? "bg-red-400"
                            : "bg-slate-600"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                    AI Activity
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {aiActivity}
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={runningDemo ? "text-amber-300" : "text-slate-600"}>
                    {runningDemo ? "◉" : "○"}
                  </span>
                  <span className={runningDemo ? "text-slate-200" : "text-slate-500"}>
                    Connecting to market data
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={runningDemo ? "text-amber-300" : "text-slate-600"}>
                    {runningDemo ? "◉" : "○"}
                  </span>
                  <span className={runningDemo ? "text-slate-200" : "text-slate-500"}>
                    Scanning 5 markets
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={runningDemo ? "text-amber-300" : "text-slate-600"}>
                    {runningDemo ? "◉" : "○"}
                  </span>
                  <span className={runningDemo ? "text-slate-200" : "text-slate-500"}>
                    Analyzing market conditions
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={runningDemo ? "text-amber-300" : "text-slate-600"}>
                    {runningDemo ? "◉" : "○"}
                  </span>
                  <span className={runningDemo ? "text-slate-200" : "text-slate-500"}>
                    Running risk filter
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={
                      aiActivity === "COMPLETE"
                        ? "text-emerald-300"
                        : "text-slate-600"
                    }
                  >
                    {aiActivity === "COMPLETE" ? "✓" : "○"}
                  </span>
                  <span
                    className={
                      aiActivity === "COMPLETE"
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }
                  >
                    Analysis complete
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Markets
                </span>
                <span className="font-semibold">
                  5
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">
                  Min Confidence
                </span>
                <span className="font-semibold">
                  75%
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">
                  Max Position
                </span>
                <span className="font-semibold">
                  5%
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">
                  Risk Filter
                </span>
                <span className="font-semibold text-emerald-300">
                  LOW
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                demoActive
                  ? stopDemoAI()
                  : startDemoAI()
              }
              className="mt-5 w-full rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {demoActive
                ? "■ Matikan AI Demo"
                : "▶ Jalankan AI Demo"}
            </button>

            {demoError ? (
              <p className="mt-3 text-xs leading-5 text-red-300">
                {demoError}
              </p>
            ) : null}
          </aside>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  PORTFOLIO
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Open Positions
                </h2>
              </div>

              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-500">
                {positions.length} open
              </span>
            </div>

            {positions.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-8 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  Belum ada posisi terbuka
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  AI tidak akan membuka posisi
                  jika kondisi market belum
                  memenuhi kriterianya.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {positions.map(
                  (position) => (
                    <button
                      key={position.id}
                      type="button"
                      onClick={() =>
                        setSelectedSymbol(
                          position.symbol,
                        )
                      }
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-slate-700"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            {position.symbol}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                              position.side ===
                              "BUY"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border-red-500/20 bg-red-500/10 text-red-300"
                            }`}
                          >
                            {position.side}
                          </span>
                        </div>

                        <span
                          className={`font-bold ${
                            position.unrealizedPnl >=
                            0
                              ? "text-emerald-300"
                              : "text-red-300"
                          }`}
                        >
                          {formatRupiah(
                            position.unrealizedPnl,
                          )}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-slate-600">
                            Quantity
                          </p>
                          <p className="mt-1 font-semibold text-slate-300">
                            {formatQuantity(
                              position.quantity,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-600">
                            Entry
                          </p>
                          <p className="mt-1 font-semibold text-slate-300">
                            $
                            {formatPrice(
                              position.entryPrice,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-600">
                            Current
                          </p>
                          <p className="mt-1 font-semibold text-slate-300">
                            $
                            {formatPrice(
                              position.currentPrice,
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  EXECUTION LOG
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Recent AI Trades
                </h2>
              </div>

              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-500">
                {trades.length}
              </span>
            </div>

            {trades.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-8 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  Belum ada eksekusi
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Riwayat AI execution akan
                  muncul di sini ketika AI
                  membuka atau menutup posisi.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-600">
                    <tr>
                      <th className="pb-3 font-medium">
                        Market
                      </th>
                      <th className="pb-3 font-medium">
                        Action
                      </th>
                      <th className="pb-3 font-medium">
                        Type
                      </th>
                      <th className="pb-3 font-medium">
                        Price
                      </th>
                      <th className="pb-3 text-right font-medium">
                        P&L
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {trades.map(
                      (trade) => (
                        <tr
                          key={trade.id}
                          className="border-b border-slate-800/70 last:border-0"
                        >
                          <td className="py-3 font-semibold">
                            {trade.symbol}
                          </td>

                          <td
                            className={`py-3 font-bold ${
                              trade.side ===
                              "BUY"
                                ? "text-emerald-300"
                                : "text-red-300"
                            }`}
                          >
                            {trade.side}
                          </td>

                          <td className="py-3">
                            <span className="rounded-full bg-slate-950 px-2 py-1 text-slate-500">
                              {trade.type}
                            </span>
                          </td>

                          <td className="py-3 text-slate-400">
                            $
                            {formatPrice(
                              trade.price,
                            )}
                          </td>

                          <td
                            className={`py-3 text-right font-semibold ${
                              trade.realizedPnl >=
                              0
                                ? "text-emerald-300"
                                : "text-red-300"
                            }`}
                          >
                            {trade.type ===
                            "CLOSE"
                              ? formatRupiah(
                                  trade.realizedPnl,
                                )
                              : "--"}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-400/20 bg-slate-950">
          <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                    AI LIVE FEED
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Aktivitas AI
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Riwayat keputusan AI secara berurutan. Aktivitas terbaru
                  berada paling atas.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                {aiActivities.length} aktivitas
              </span>
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {aiActivities.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-xl">
                  🤖
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-400">
                  AI belum memiliki aktivitas
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
                  Jalankan AI Demo untuk melihat aktivitas AI muncul seperti
                  live feed.
                </p>
              </div>
            ) : (
              <div>
                {aiActivities.map((activity, index) => (
                  <article
                    key={activity.id}
                    className={`px-5 py-5 transition hover:bg-slate-900/60 sm:px-6 ${
                      index !== aiActivities.length - 1
                        ? "border-b border-slate-800/80"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm">
                          🤖
                        </div>

                        {index !== aiActivities.length - 1 ? (
                          <div className="mt-2 h-full min-h-8 w-px bg-slate-800" />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-bold text-white">
                            AI Worker
                          </span>

                          <span className="text-[11px] text-slate-600">
                            {formatTime(activity.createdAt)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-200">
                            {activity.symbol}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getActionClass(
                              activity.action,
                            )}`}
                          >
                            {activity.action}
                          </span>

                          <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-semibold text-slate-500">
                            {activity.riskLevel}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {activity.executionReason}
                        </p>

                        {activity.reasons.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {activity.reasons.slice(0, 3).map(
                              (reason, reasonIndex) => (
                                <p
                                  key={`${activity.id}-reason-${reasonIndex}`}
                                  className="text-xs leading-5 text-slate-500"
                                >
                                  • {reason}
                                </p>
                              ),
                            )}
                          </div>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
                          <span className="text-slate-600">
                            Confidence{" "}
                            <span className="font-bold text-slate-400">
                              {activity.confidence.toFixed(1)}%
                            </span>
                          </span>

                          <span className="text-slate-600">
                            Score{" "}
                            <span className="font-bold text-slate-400">
                              {activity.totalScore.toFixed(1)}
                            </span>
                          </span>

                          <span className="text-slate-600">
                            Trend{" "}
                            <span className="font-bold text-slate-400">
                              {activity.trend}
                            </span>
                          </span>

                          <span
                            className={`font-bold ${
                              activity.executionStatus === "EXECUTED"
                                ? "text-emerald-300"
                                : activity.executionStatus === "REJECTED"
                                  ? "text-red-300"
                                  : "text-amber-300"
                            }`}
                          >
                            {activity.executionStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {demoResult ? (
          <section className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  LAST AI CYCLE
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Siklus AI selesai
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-slate-950/70 px-4 py-3">
                  <p className="text-[10px] text-slate-600">
                    SCANNED
                  </p>
                  <p className="mt-1 font-bold">
                    {demoResult.analyzed}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/70 px-4 py-3">
                  <p className="text-[10px] text-slate-600">
                    OPENED
                  </p>
                  <p className="mt-1 font-bold text-emerald-300">
                    {demoResult.executed}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/70 px-4 py-3">
                  <p className="text-[10px] text-slate-600">
                    CLOSED
                  </p>
                  <p className="mt-1 font-bold">
                    {demoResult.monitored.closed}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {demoResult.decisions.map(
                (decision) => (
                  <article
                    key={decision.symbol}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">
                        {decision.symbol}
                      </span>

                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-bold ${getActionClass(
                          decision.action,
                        )}`}
                      >
                        {decision.action}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-600">
                          Confidence
                        </p>
                        <p className="mt-1 font-semibold">
                          {decision.confidence.toFixed(
                            1,
                          )}
                          %
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-600">
                          Risk
                        </p>
                        <p className="mt-1 font-semibold text-emerald-300">
                          {decision.riskLevel}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      {decision.executed
                        ? "AI membuka posisi Demo."
                        : decision.reason ??
                          "Tidak ada eksekusi pada siklus ini."}
                    </p>
                  </article>
                ),
              )}
            </div>
          </section>
        ) : null}

        <footer className="mt-8 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-3 text-xs text-slate-600 sm:flex-row">
            <p>
              APLIFIX Trader AI Member ·
              Demo Environment
            </p>

            <p>
              Data market real-time ·
              Eksekusi virtual
            </p>
          </div>

          <p className="mt-3 max-w-4xl text-[11px] leading-5 text-slate-700">
            Demo Account menggunakan dana
            virtual. Informasi market dan hasil
            simulasi bukan jaminan keuntungan
            perdagangan nyata dan bukan
            rekomendasi investasi.
          </p>
        </footer>
      </div>
    </main>
  );
}
