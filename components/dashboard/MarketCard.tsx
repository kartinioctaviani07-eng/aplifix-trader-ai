"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Card from "@/components/ui/Card";

import {
  useAIFocus,
} from "@/context/AIFocusContext";


type MarketData = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
};


type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};


type MarketResponse = {
  success: boolean;
  data?: MarketData;
};


type CandleResponse = {
  success: boolean;
  data?: Candle[];
};


type MarketCardState = {
  market: MarketData | null;
  candles: Candle[];
  loading: boolean;
  error: boolean;
};


const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
] as const;


function formatPrice(
  price: number
): string {
  if (price >= 1000) {
    return price.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    );
  }

  if (price >= 1) {
    return price.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 4,
      }
    );
  }

  return price.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 6,
    }
  );
}


function MiniChart({
  candles,
}: {
  candles: Candle[];
}) {
  const visibleCandles =
    useMemo(
      () => candles.slice(-30),
      [candles]
    );


  const points =
    useMemo(() => {
      if (
        visibleCandles.length < 2
      ) {
        return "";
      }


      const closes =
        visibleCandles.map(
          (candle) =>
            candle.close
        );


      const min =
        Math.min(...closes);

      const max =
        Math.max(...closes);

      const range =
        max - min || 1;


      const width = 220;
      const height = 70;
      const padding = 4;


      return closes
        .map(
          (
            close,
            index
          ) => {
            const x =
              padding +
              (index /
                Math.max(
                  closes.length - 1,
                  1
                )) *
                (width -
                  padding * 2);


            const y =
              height -
              padding -
              ((close - min) /
                range) *
                (height -
                  padding * 2);


            return `${x},${y}`;
          }
        )
        .join(" ");
    }, [visibleCandles]);


  if (!points) {
    return (
      <div className="flex h-[70px] items-center justify-center rounded-lg bg-slate-900/70">
        <span className="text-xs text-slate-500">
          Chart unavailable
        </span>
      </div>
    );
  }


  const first =
    visibleCandles[0]?.close ??
    0;


  const last =
    visibleCandles.at(-1)
      ?.close ?? 0;


  const isUp =
    last >= first;


  return (
    <div className="h-[70px] overflow-hidden rounded-lg bg-slate-900/70">
      <svg
        viewBox="0 0 220 70"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke={
            isUp
              ? "rgb(52 211 153)"
              : "rgb(248 113 113)"
          }
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}


function MarketMiniCard({
  symbol,
  state,
  active,
}: {
  symbol: string;
  state: MarketCardState;
  active: boolean;
}) {
  const {
    market,
    candles,
    loading,
    error,
  } = state;


  const changePositive =
    (market?.changePercent ?? 0) >= 0;


  return (
    <div
      className={[
        "rounded-xl border p-4",
        "bg-slate-950/70",
        active
          ? "border-emerald-400/70 shadow-lg shadow-emerald-500/10"
          : "border-slate-800",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">
            {symbol}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {active
              ? "AI Focus"
              : "Market"}
          </p>
        </div>


        {market && (
          <span
            className={
              changePositive
                ? "text-xs font-semibold text-emerald-400"
                : "text-xs font-semibold text-red-400"
            }
          >
            {changePositive
              ? "+"
              : ""}
            {market.changePercent.toFixed(
              2
            )}
            %
          </span>
        )}
      </div>


      <div className="mt-4">
        <MiniChart
          candles={candles}
        />
      </div>


      <div className="mt-4">
        {loading && !market ? (
          <p className="text-sm text-slate-500">
            Loading market...
          </p>
        ) : error && !market ? (
          <p className="text-sm text-red-400">
            Market data unavailable
          </p>
        ) : market ? (
          <>
            <p className="text-xl font-bold text-white">
              $
              {formatPrice(
                market.price
              )}
            </p>


            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">
                  High
                </p>

                <p className="mt-1 text-slate-300">
                  $
                  {formatPrice(
                    market.high
                  )}
                </p>
              </div>


              <div>
                <p className="text-slate-500">
                  Low
                </p>

                <p className="mt-1 text-slate-300">
                  $
                  {formatPrice(
                    market.low
                  )}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            Waiting for market data...
          </p>
        )}
      </div>
    </div>
  );
}


export default function MarketCard() {
  const {
    focus,
  } = useAIFocus();


  const [states, setStates] =
    useState<
      Record<
        string,
        MarketCardState
      >
    >(() =>
      Object.fromEntries(
        SYMBOLS.map(
          (symbol) => [
            symbol,
            {
              market: null,
              candles: [],
              loading: true,
              error: false,
            },
          ]
        )
      )
    );


  useEffect(() => {
    let cancelled = false;


    async function loadSymbol(
      symbol: string
    ) {
      try {
        const [
          marketResponse,
          candleResponse,
        ] = await Promise.all([
          fetch(
            `/api/market?symbol=${symbol}`,
            {
              cache: "no-store",
            }
          ),

          fetch(
            `/api/candles?symbol=${symbol}&interval=1h`,
            {
              cache: "no-store",
            }
          ),
        ]);


        const marketResult:
          MarketResponse =
          await marketResponse.json();


        const candleResult:
          CandleResponse =
          await candleResponse.json();


        if (cancelled) {
          return;
        }


        setStates(
          (previous) => ({
            ...previous,

            [symbol]: {
              market:
                marketResult.success
                  ? marketResult.data ??
                    null
                  : previous[symbol]
                      ?.market ??
                    null,

              candles:
                candleResult.success
                  ? candleResult.data ??
                    []
                  : previous[symbol]
                      ?.candles ??
                    [],

              loading: false,

              error:
                !marketResult.success &&
                !candleResult.success,
            },
          })
        );
      } catch (error) {
        if (cancelled) {
          return;
        }


        console.error(
          `Market load error for ${symbol}:`,
          error
        );


        setStates(
          (previous) => ({
            ...previous,

            [symbol]: {
              ...previous[symbol],

              loading: false,
              error: true,
            },
          })
        );
      }
    }


    async function loadAll() {
      await Promise.all(
        SYMBOLS.map(
          (symbol) =>
            loadSymbol(symbol)
        )
      );
    }


    loadAll();


    const interval =
      window.setInterval(
        loadAll,
        30000
      );


    return () => {
      cancelled = true;

      window.clearInterval(
        interval
      );
    };
  }, []);


  return (
    <Card title="Market Overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SYMBOLS.map(
          (symbol) => (
            <MarketMiniCard
              key={symbol}
              symbol={symbol}
              state={
                states[symbol]
              }
              active={
                focus?.symbol ===
                symbol
              }
            />
          )
        )}
      </div>
    </Card>
  );
}