"use client";

import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import { useAIFocus } from "@/context/AIFocusContext";

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

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  }

  if (price >= 1) {
    return price.toLocaleString("en-US", {
      maximumFractionDigits: 4,
    });
  }

  return price.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

function MiniCandlestickChart({
  candles,
}: {
  candles: Candle[];
}) {
  const visibleCandles = useMemo(
    () => candles.slice(-30),
    [candles]
  );

  const chart = useMemo(() => {
    if (visibleCandles.length < 2) {
      return null;
    }

    const width = 300;
    const height = 105;
    const paddingX = 5;
    const paddingY = 8;

    const minPrice = Math.min(
      ...visibleCandles.map((candle) => candle.low)
    );

    const maxPrice = Math.max(
      ...visibleCandles.map((candle) => candle.high)
    );

    const range = maxPrice - minPrice || 1;
    const chartHeight = height - paddingY * 2;
    const chartWidth = width - paddingX * 2;

    const candleSlot =
      chartWidth / visibleCandles.length;

    const candleWidth = Math.max(
      3,
      Math.min(7, candleSlot * 0.62)
    );

    const priceToY = (price: number) =>
      paddingY +
      ((maxPrice - price) / range) *
        chartHeight;

    const renderedCandles = visibleCandles.map(
      (candle, index) => {
        const centerX =
          paddingX +
          index * candleSlot +
          candleSlot / 2;

        const openY = priceToY(candle.open);
        const closeY = priceToY(candle.close);
        const highY = priceToY(candle.high);
        const lowY = priceToY(candle.low);

        return {
          centerX,
          bodyTop: Math.min(openY, closeY),
          bodyHeight: Math.max(
            2,
            Math.abs(closeY - openY)
          ),
          highY,
          lowY,
          bullish: candle.close >= candle.open,
        };
      }
    );

    return {
      width,
      height,
      candleWidth,
      candles: renderedCandles,
    };
  }, [visibleCandles]);

  if (!chart) {
    return (
      <div className="flex h-[105px] items-center justify-center rounded-lg bg-slate-900/70">
        <span className="text-xs text-slate-500">
          Chart unavailable
        </span>
      </div>
    );
  }

  return (
    <div className="h-[105px] overflow-hidden rounded-lg bg-slate-900/70">
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {chart.candles.map((candle, index) => {
          const candleColor = candle.bullish
            ? "rgb(52 211 153)"
            : "rgb(248 113 113)";

          return (
            <g key={`${index}-${candle.centerX}`}>
              <line
                x1={candle.centerX}
                x2={candle.centerX}
                y1={candle.highY}
                y2={candle.lowY}
                stroke={candleColor}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              <rect
                x={
                  candle.centerX -
                  chart.candleWidth / 2
                }
                y={candle.bodyTop}
                width={chart.candleWidth}
                height={candle.bodyHeight}
                rx="0.8"
                fill={candleColor}
              />
            </g>
          );
        })}
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
            Crypto Market
          </p>
        </div>

        {active && (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
            AI Focus
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-white">
            {market
              ? formatPrice(market.price)
              : loading
                ? "Loading..."
                : "--"}
          </p>

          {market && (
            <p
              className={[
                "mt-1 text-xs font-semibold",
                changePositive
                  ? "text-emerald-400"
                  : "text-red-400",
              ].join(" ")}
            >
              {changePositive ? "+" : ""}
              {market.changePercent.toFixed(2)}%
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        {error ? (
          <div className="flex h-[105px] items-center justify-center rounded-lg bg-slate-900/70">
            <span className="text-xs text-slate-500">
              Market data unavailable
            </span>
          </div>
        ) : (
          <MiniCandlestickChart
            candles={candles}
          />
        )}
      </div>

      {market && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-slate-900/60 p-2">
            <p className="text-slate-500">
              High
            </p>

            <p className="mt-1 font-medium text-slate-200">
              {formatPrice(market.high)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-900/60 p-2">
            <p className="text-slate-500">
              Low
            </p>

            <p className="mt-1 font-medium text-slate-200">
              {formatPrice(market.low)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketCard() {
  const { focus } = useAIFocus();

  const [states, setStates] =
    useState<Record<
      string,
      MarketCardState
    >>(() =>
      Object.fromEntries(
        SYMBOLS.map((symbol) => [
          symbol,
          {
            market: null,
            candles: [],
            loading: true,
            error: false,
          },
        ])
      )
    );

  useEffect(() => {
    let cancelled = false;

    async function loadSymbol(symbol: string) {
      try {
        const [
          marketResponse,
          candleResponse,
        ] = await Promise.all([
          fetch(
            `/api/market?symbol=${encodeURIComponent(symbol)}`,
            {
              cache: "no-store",
            }
          ),
          fetch(
            `/api/candles?symbol=${encodeURIComponent(symbol)}&interval=1h`,
            {
              cache: "no-store",
            }
          ),
        ]);

        if (!marketResponse.ok) {
          throw new Error(
            `Market request failed for ${symbol}`
          );
        }

        const marketData =
          (await marketResponse.json()) as MarketResponse;

        const candleData =
          candleResponse.ok
            ? ((await candleResponse.json()) as CandleResponse)
            : null;

        if (cancelled) {
          return;
        }

        setStates((current) => ({
          ...current,
          [symbol]: {
            market:
              marketData.success &&
              marketData.data
                ? marketData.data
                : null,
            candles:
              candleData?.success &&
              candleData.data
                ? candleData.data
                : [],
            loading: false,
            error:
              !marketData.success ||
              !marketData.data,
          },
        }));
      } catch (error) {
        console.error(
          `Failed to load ${symbol}`,
          error
        );

        if (cancelled) {
          return;
        }

        setStates((current) => ({
          ...current,
          [symbol]: {
            market: null,
            candles: [],
            loading: false,
            error: true,
          },
        }));
      }
    }

    async function loadAll() {
      await Promise.all(
        SYMBOLS.map((symbol) =>
          loadSymbol(symbol)
        )
      );
    }

    void loadAll();

    const interval = window.setInterval(() => {
      void loadAll();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Card title="Market Overview">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Market Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Live crypto market overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SYMBOLS.map((symbol) => (
          <MarketMiniCard
            key={symbol}
            symbol={symbol}
            state={
              states[symbol] ?? {
                market: null,
                candles: [],
                loading: true,
                error: false,
              }
            }
            active={
              focus?.symbol === symbol
            }
          />
        ))}
      </div>
    </Card>
  );
}
