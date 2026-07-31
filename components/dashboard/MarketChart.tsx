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

  const [price, setPrice] =
    useState<number | null>(null);

  const [provider, setProvider] =
    useState("");

  const [updatedAt, setUpdatedAt] =
    useState("");

  useEffect(() => {

    if (
      !chartContainerRef.current ||
      !focus
    ) {
      return;
    }

    const symbol =
      focus.symbol;

    const chart =
      createChart(
        chartContainerRef.current,
        {
          width:
            chartContainerRef.current.clientWidth,

          height: 420,

          layout: {
            background: {
              type: ColorType.Solid,
              color: "#020617",
            },
            textColor: "#CBD5E1",
          },

          grid: {
            vertLines: {
              color: "#1E293B",
            },
            horzLines: {
              color: "#1E293B",
            },
          },

          timeScale: {
            timeVisible: true,
          },

        }
      );

    const candleSeries =
      chart.addSeries(
        CandlestickSeries
      );

    const closeSeries =
      chart.addSeries(
        LineSeries
      );

    async function loadCandles() {

      try {

        const response =
          await fetch(
            `/api/candles?symbol=${symbol}`,
            {
              cache: "no-store",
            }
          );

        const result:
          CandleResponse =
          await response.json();

        if (!result.success) {

          throw new Error(
            "Load candle gagal."
          );

        }

        candleSeries.setData(

          result.data.map(
            (item) => ({
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
          )

        );

        closeSeries.setData(

          result.data.map(
            (item) => ({
              time:
                item.time as Time,
              value:
                item.close,
            })
          )

        );

        const last =
          result.data.at(-1);

        if (last) {

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

        console.error(
          "Chart Error:",
          error
        );

      }

    }

    loadCandles();

    const timer =
      setInterval(
        loadCandles,
        10000
      );

    const resize =
      () => {

        if (
          chartContainerRef.current
        ) {

          chart.applyOptions({

            width:
              chartContainerRef.current.clientWidth,

          });

        }

      };

    window.addEventListener(
      "resize",
      resize
    );

    return () => {

      clearInterval(
        timer
      );

      window.removeEventListener(
        "resize",
        resize
      );

      chart.remove();

    };

  }, [focus]);

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">

            {(focus?.symbol ?? "--")} Market Chart

          </h2>

          <p className="text-sm text-slate-400">

            Candlestick • AI Focus Market

          </p>

        </div>

        <div className="text-right">

          <p className="text-2xl font-bold text-emerald-400">

            {
              price
                ? `$${price.toFixed(2)}`
                : "--"
            }

          </p>

          <p className="text-xs text-slate-400">

            {provider}

          </p>

          <p className="text-xs text-slate-500">

            Update {updatedAt || "-"}

          </p>

        </div>

      </div>

      <div
        ref={chartContainerRef}
        className="w-full"
      />

    </div>

  );

}
