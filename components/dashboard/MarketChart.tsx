"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
  Time,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
} from "lightweight-charts";

import {
  useAIFocus,
} from "@/context/AIFocusContext";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type CandleResponse = {
  success: boolean;
  mode?: string;
  data: Candle[];
};

export default function MarketChart() {
  const {
    focus,
  } = useAIFocus();

  const chartContainerRef =
    useRef<HTMLDivElement | null>(null);

  const chartRef =
    useRef<IChartApi | null>(null);

  const candleSeriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(null);

  const closeSeriesRef =
    useRef<ISeriesApi<"Line"> | null>(null);

  const abortControllerRef =
    useRef<AbortController | null>(null);

  const lastCandleTimeRef =
    useRef<number | null>(null);

  const currentSymbolRef =
    useRef<string | null>(null);

  const [price, setPrice] =
    useState<number | null>(null);

  const [provider, setProvider] =
    useState("");

  const [updatedAt, setUpdatedAt] =
    useState("");

  const symbol =
    focus?.symbol ?? null;

  useEffect(() => {
    if (
      !chartContainerRef.current ||
      !symbol
    ) {
      return;
    }

    const container =
      chartContainerRef.current;

    currentSymbolRef.current =
      symbol;

    abortControllerRef.current?.abort();

    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    const chart =
      createChart(
        container,
        {
          width:
            container.clientWidth,

          height: 420,

          layout: {
            background: {
              type:
                ColorType.Solid,

              color:
                "#020617",
            },

            textColor:
              "#CBD5E1",
          },

          grid: {
            vertLines: {
              color:
                "#1E293B",
            },

            horzLines: {
              color:
                "#1E293B",
            },
          },

          rightPriceScale: {
            borderColor:
              "#1E293B",
          },

          timeScale: {
            timeVisible:
              true,

            secondsVisible:
              false,

            borderColor:
              "#1E293B",

            rightOffset:
              4,

            barSpacing:
              8,
          },

          crosshair: {
            vertLine: {
              color:
                "#64748B",

              width:
                1,
            },

            horzLine: {
              color:
                "#64748B",

              width:
                1,
            },
          },
        }
      );

    chartRef.current =
      chart;

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor:
            "#26a69a",

          downColor:
            "#ef5350",

          borderUpColor:
            "#26a69a",

          borderDownColor:
            "#ef5350",

          wickUpColor:
            "#26a69a",

          wickDownColor:
            "#ef5350",
        }
      );

    const closeSeries =
      chart.addSeries(
        LineSeries,
        {
          color:
            "#38bdf8",

          lineWidth:
            2,

          priceLineVisible:
            false,

          lastValueVisible:
            false,
        }
      );

    candleSeriesRef.current =
      candleSeries;

    closeSeriesRef.current =
      closeSeries;

    lastCandleTimeRef.current =
      null;

    let disposed =
      false;

    const loadInitialCandles =
      async () => {
        try {
          const response =
            await fetch(
              `/api/candles?symbol=${encodeURIComponent(symbol)}`,
              {
                cache:
                  "no-store",

                signal:
                  controller.signal,
              }
            );

          if (
            controller.signal.aborted
          ) {
            return;
          }

          const result:
            CandleResponse =
            await response.json();

          if (
            controller.signal.aborted ||
            disposed
          ) {
            return;
          }

          if (
            !result.success ||
            !Array.isArray(result.data) ||
            result.data.length === 0
          ) {
            throw new Error(
              "Data candle tidak tersedia."
            );
          }

          const candleData:
            CandlestickData<Time>[] =
            result.data.map(
              (
                item
              ) => ({
                time:
                  item.time as Time,

                open:
                  item.open,

                high:
                  item.high,

                low:
                  item.low,

                close:
                  item.close,
              })
            );

          const lineData:
            LineData<Time>[] =
            result.data.map(
              (
                item
              ) => ({
                time:
                  item.time as Time,

                value:
                  item.close,
              })
            );

          candleSeries.setData(
            candleData
          );

          closeSeries.setData(
            lineData
          );

          const last =
            result.data.at(-1);

          if (last) {
            lastCandleTimeRef.current =
              last.time;

            setPrice(
              last.close
            );
          }

          setProvider(
            result.mode ??
            "Unknown"
          );

          setUpdatedAt(
            new Date()
              .toLocaleTimeString()
          );

          chart.timeScale()
            .fitContent();
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "MarketChart initial load error:",
            error
          );
        }
      };

    const updateLatestCandle =
      async () => {
        try {
          if (
            controller.signal.aborted ||
            disposed ||
            currentSymbolRef.current !== symbol
          ) {
            return;
          }

          const response =
            await fetch(
              `/api/candles?symbol=${encodeURIComponent(symbol)}`,
              {
                cache:
                  "no-store",

                signal:
                  controller.signal,
              }
            );

          if (
            controller.signal.aborted ||
            disposed ||
            currentSymbolRef.current !== symbol
          ) {
            return;
          }

          const result:
            CandleResponse =
            await response.json();

          if (
            !result.success ||
            !Array.isArray(result.data) ||
            result.data.length === 0
          ) {
            return;
          }

          const latest =
            result.data.at(-1);

          if (!latest) {
            return;
          }

          const previousTime =
            lastCandleTimeRef.current;

          const latestTime =
            latest.time;

          if (
            previousTime === null ||
            latestTime >= previousTime
          ) {
            candleSeries.update(
              {
                time:
                  latest.time as Time,

                open:
                  latest.open,

                high:
                  latest.high,

                low:
                  latest.low,

                close:
                  latest.close,
              }
            );

            closeSeries.update(
              {
                time:
                  latest.time as Time,

                value:
                  latest.close,
              }
            );

            lastCandleTimeRef.current =
              latest.time;

            setPrice(
              latest.close
            );

            setProvider(
              result.mode ??
              "Unknown"
            );

            setUpdatedAt(
              new Date()
                .toLocaleTimeString()
            );
          }
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "MarketChart update error:",
            error
          );
        }
      };

    loadInitialCandles();

    const timer =
      window.setInterval(
        updateLatestCandle,
        5000
      );

    const resize =
      () => {
        if (
          container &&
          chartRef.current
        ) {
          chartRef.current.applyOptions(
            {
              width:
                container.clientWidth,
            }
          );
        }
      };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {
      disposed =
        true;

      window.clearInterval(
        timer
      );

      window.removeEventListener(
        "resize",
        resize
      );

      controller.abort();

      if (
        abortControllerRef.current ===
        controller
      ) {
        abortControllerRef.current =
          null;
      }

      if (
        candleSeriesRef.current ===
        candleSeries
      ) {
        candleSeriesRef.current =
          null;
      }

      if (
        closeSeriesRef.current ===
        closeSeries
      ) {
        closeSeriesRef.current =
          null;
      }

      if (
        chartRef.current ===
        chart
      ) {
        chartRef.current =
          null;
      }

      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            {(symbol ?? "--")} Market Chart
          </h2>

          <p className="text-sm text-slate-400">
            Candlestick • AI Focus Market
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-400">
            {
              price !== null
                ? `$${price.toFixed(2)}`
                : "--"
            }
          </p>

          <p className="text-xs text-slate-400">
            {provider || "Connecting..."}
          </p>

          <p className="text-xs text-slate-500">
            Update {updatedAt || "-"}
          </p>
        </div>
      </div>

      {!symbol ? (
        <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
          <p className="text-slate-500">
            Pilih market untuk melihat chart.
          </p>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          className="w-full"
        />
      )}
    </div>
  );
}
