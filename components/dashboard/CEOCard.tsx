"use client";

import { useCallback, useEffect, useState } from "react";

type CEOAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

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
} | null;

type AccountSnapshot = {
  initialBalance: number;
  balance: number;
  realizedProfit: number;
  equity: number;
  totalTrades: number;
  winRate: number;
};

type CEOData = {
  symbol: string;
  action: CEOAction;
  confidence: number;
  price: number;
  riskLevel: string;
  position: Position;
  executed: boolean;
  message: string;
  account: AccountSnapshot;
  timestamp: number;
};

type CEOResponse = {
  success: boolean;
  data?: CEOData;
  message?: string;
};

type AccountResponse = {
  success: boolean;
  account?: AccountSnapshot;
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function actionClass(action: CEOAction): string {
  if (action === "BUY") {
    return "text-emerald-400";
  }

  if (action === "SELL") {
    return "text-red-400";
  }

  if (action === "HOLD") {
    return "text-yellow-400";
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

export default function CEOCard() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [account, setAccount] =
    useState<AccountSnapshot | null>(null);
  const [ceo, setCeo] =
    useState<CEOData | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [accountLoading, setAccountLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const loadAccount = useCallback(
    async () => {
      try {
        const response =
          await fetch(
            "/api/ceo-account",
            {
              cache: "no-store",
            }
          );

        const data =
          (await response.json()) as AccountResponse;

        if (
          data.success &&
          data.account
        ) {
          setAccount(data.account);
        }
      } catch {
        setError(
          "Data akun CEO tidak dapat dimuat."
        );
      } finally {
        setAccountLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadAccount();

    const interval =
      window.setInterval(
        () => {
          void loadAccount();
        },
        15000
      );

    return () =>
      window.clearInterval(interval);
  }, [loadAccount]);

  async function analyzeCEO() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/ceo?symbol=${symbol}`,
          {
            cache: "no-store",
          }
        );

      const data =
        (await response.json()) as CEOResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.data
      ) {
        throw new Error(
          data.message ??
            "CEO gagal melakukan analisis."
        );
      }

      setCeo(data.data);
      setAccount(data.data.account);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "CEO gagal melakukan analisis."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6 shadow-xl shadow-emerald-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg text-emerald-400">
              AI
            </span>

            <div>
              <h2 className="text-xl font-bold text-white">
                CEO APLIFIX
              </h2>

              <p className="text-sm text-slate-400">
                Autonomous AI Trading Decision Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={symbol}
            onChange={(event) =>
              setSymbol(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="BTCUSDT">
              BTCUSDT
            </option>
            <option value="ETHUSDT">
              ETHUSDT
            </option>
            <option value="BNBUSDT">
              BNBUSDT
            </option>
            <option value="SOLUSDT">
              SOLUSDT
            </option>
            <option value="XRPUSDT">
              XRPUSDT
            </option>
            <option value="ADAUSDT">
              ADAUSDT
            </option>
            <option value="DOGEUSDT">
              DOGEUSDT
            </option>
          </select>

          <button
            type="button"
            onClick={() => {
              void analyzeCEO();
            }}
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Menganalisis..."
              : "Analisis CEO"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Balance
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {accountLoading
              ? "Loading..."
              : formatRupiah(
                  account?.balance ?? 0
                )}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Realized Profit
          </p>

          <p
            className={`mt-2 text-lg font-bold ${
              (account?.realizedProfit ?? 0) >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {accountLoading
              ? "Loading..."
              : formatRupiah(
                  account?.realizedProfit ?? 0
                )}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Total Trades
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {account?.totalTrades ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Win Rate
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {account?.winRate ?? 0}%
          </p>
        </div>
      </div>

      {ceo ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-5">
          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                CEO Decision
              </p>

              <p
                className={`mt-2 text-2xl font-black ${actionClass(
                  ceo.action
                )}`}
              >
                {ceo.action}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Confidence
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {ceo.confidence}%
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Risk
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${riskClass(
                  ceo.riskLevel
                )}`}
              >
                {ceo.riskLevel}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Market Price
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                ${formatPrice(ceo.price)}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-300">
              {ceo.message}
            </p>

            {ceo.position && (
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                <div>
                  <span className="text-slate-500">
                    Position
                  </span>

                  <p className="font-semibold text-white">
                    {ceo.position.side}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Entry
                  </span>

                  <p className="font-semibold text-white">
                    ${formatPrice(
                      ceo.position.entryPrice
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Stop Loss
                  </span>

                  <p className="font-semibold text-red-400">
                    ${formatPrice(
                      ceo.position.stopLoss
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Take Profit
                  </span>

                  <p className="font-semibold text-emerald-400">
                    ${formatPrice(
                      ceo.position.takeProfit
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
          CEO belum menjalankan analisis.
          Pilih market lalu tekan{" "}
          <span className="font-semibold text-emerald-400">
            Analisis CEO
          </span>
          .
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </section>
  );
}
