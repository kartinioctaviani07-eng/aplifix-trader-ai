"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type Time,
} from "lightweight-charts";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleResponse {
  success: boolean;
  mode?: string;
  data?: Candle[];
  message?: string;
}

interface MemberMarketChartProps {
  symbol: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(price);
}

export default function MemberMarketChart({
  symbol,
}: MemberMarketChartProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const chartRef =
    useRef<IChartApi | null>(null);

  const candleSeriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(null);

  const lastTimeRef =
    useRef<number | null>(null);

  const [price, setPrice] =
    useState<number | null>(null);

  const [provider, setProvider] =
    useState("Connecting...");

  const [updatedAt, setUpdatedAt] =
    useState("");

  const [chartError, setChartError] =
    useState("");

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container || !symbol) {
      return;
    }

    let disposed = false;

    const controller =
      new AbortController();

    const chart =
      createChart(container, {
        width: container.clientWidth,
        height: 430,
        layout: {
          background: {
            type: ColorType.Solid,
            color: "#020617",
          },
          textColor: "#94A3B8",
        },
        grid: {
          vertLines: {
            color: "#172033",
          },
          horzLines: {
            color: "#172033",
          },
        },
        rightPriceScale: {
          borderColor: "#1E293B",
        },
        timeScale: {
          borderColor: "#1E293B",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
      });

    chartRef.current = chart;

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#10B981",
          downColor: "#EF4444",
          borderUpColor: "#10B981",
          borderDownColor: "#EF4444",
          wickUpColor: "#10B981",
          wickDownColor: "#EF4444",
        },
      );

    candleSeriesRef.current =
      candleSeries;

    async function loadCandles(): Promise<void> {
      try {
        const response =
          await fetch(
            `/api/candles?symbol=${encodeURIComponent(symbol)}&interval=1h`,
            {
              cache: "no-store",
              signal: controller.signal,
            },
          );

        const result =
          (await response.json()) as CandleResponse;

        if (
          disposed ||
          controller.signal.aborted
        ) {
          return;
        }

        if (
          !response.ok ||
          !result.success ||
          !Array.isArray(result.data) ||
          result.data.length === 0
        ) {
          throw new Error(
            result.message ??
              "Data chart tidak tersedia.",
          );
        }

        const data =
          result.data.map(
            (
              item,
            ): CandlestickData<Time> => ({
              time: item.time as Time,
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
            }),
          );

        candleSeries.setData(data);

        const latest =
          result.data.at(-1);

        if (latest) {
          lastTimeRef.current =
            latest.time;

          setPrice(latest.close);
        }

        setProvider(
          result.mode ?? "MarketHub",
        );

        setUpdatedAt(
          new Date().toLocaleTimeString(
            "id-ID",
          ),
        );

        setChartError("");

        chart.timeScale().fitContent();
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Member chart error:",
          error,
        );

        if (!disposed) {
          setChartError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil data chart.",
          );
        }
      }
    }

    void loadCandles();

    const timer =
      window.setInterval(
        () => {
          void loadCandles();
        },
        5000,
      );

    const resizeObserver =
      new ResizeObserver(() => {
        if (
          chartRef.current &&
          container.clientWidth > 0
        ) {
          chartRef.current.applyOptions({
            width:
              container.clientWidth,
          });
        }
      });

    resizeObserver.observe(container);

    return () => {
      disposed = true;

      window.clearInterval(timer);
      controller.abort();
      resizeObserver.disconnect();

      candleSeriesRef.current = null;
      chartRef.current = null;

      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            LIVE MARKET
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">
            {symbol}
          </h2>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-white">
            {price !== null
              ? `$${formatPrice(price)}`
              : "--"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {provider} ·{" "}
            {updatedAt || "Updating..."}
          </p>
        </div>
      </div>

      {chartError ? (
        <div className="flex h-[430px] items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-red-300">
              Chart belum tersedia
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {chartError}
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full"
        />
      )}
    </div>
  );
}
