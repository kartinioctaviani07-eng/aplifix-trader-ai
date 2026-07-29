"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

import { getMarketData } from "@/lib/marketData";

export default function MarketChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,

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

      rightPriceScale: {
        borderColor: "#334155",
      },

      timeScale: {
        borderColor: "#334155",
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries);

    candlestickSeries.setData(getMarketData());

    const handleResize = () => {
      if (!chartContainerRef.current) return;

      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-5 text-xl font-bold text-white">
        BTCUSDT Market Chart
      </h2>

      <div
        ref={chartContainerRef}
        className="w-full"
      />
    </div>
  );
}
