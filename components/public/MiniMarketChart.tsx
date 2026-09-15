"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type CandleApiResponse = {
  success: boolean;
  symbol: string;
  interval: string;
  mode: string;
  data: Candle[];
};

type MiniMarketChartProps = {
  symbol?: string;
};

function isCandle(value: unknown): value is Candle {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candle = value as Record<string, unknown>;

  return (
    typeof candle.time === "number" &&
    typeof candle.open === "number" &&
    typeof candle.high === "number" &&
    typeof candle.low === "number" &&
    typeof candle.close === "number"
  );
}

function isCandleApiResponse(
  value: unknown,
): value is CandleApiResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    response.success === true &&
    typeof response.symbol === "string" &&
    typeof response.interval === "string" &&
    Array.isArray(response.data) &&
    response.data.every(isCandle)
  );
}

export default function MiniMarketChart({
  symbol = "BTCUSDT",
}: MiniMarketChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 235,
      layout: {
        background: {
          type: ColorType.Solid,
          color: "transparent",
        },
        textColor: "#64748b",
      },
      grid: {
        vertLines: {
          color: "rgba(51, 65, 85, 0.20)",
        },
        horzLines: {
          color: "rgba(51, 65, 85, 0.20)",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(51, 65, 85, 0.35)",
      },
      timeScale: {
        borderColor: "rgba(51, 65, 85, 0.35)",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: "rgba(16, 185, 129, 0.45)",
        },
        horzLine: {
          color: "rgba(16, 185, 129, 0.45)",
        },
      },
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
      });
    });

    resizeObserver.observe(container);

    const loadCandles = async () => {
      try {
        const response = await fetch(
          `/api/candles?symbol=${symbol}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const payload: unknown = await response.json();

        if (!isCandleApiResponse(payload)) {
          return;
        }

        const candles: CandlestickData<Time>[] = payload.data
          .slice(-45)
          .map((candle) => ({
            time: candle.time as Time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));

        if (candles.length === 0) {
          return;
        }

        series.setData(candles);
        chart.timeScale().fitContent();
      } catch {
        // Public chart should fail silently.
      }
    };

    void loadCandles();

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="h-[235px] w-full"
      aria-label={`${symbol} live market chart`}
    />
  );
}
