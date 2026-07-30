"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  Time,
} from "lightweight-charts";


export default function MarketChart() {

  const chartContainerRef =
    useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    if (!chartContainerRef.current) return;


    const chart = createChart(
      chartContainerRef.current,
      {
        width:
          chartContainerRef.current.clientWidth,

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
      }
    );


    const candlestickSeries =
      chart.addSeries(CandlestickSeries);



    async function loadChart() {

      try {

        const response =
          await fetch(
            "/api/candles",
            {
              cache: "no-store",
            }
          );


        const result =
          await response.json();


        if (!result.success) {
          throw new Error(
            "Failed load candles"
          );
        }


        const candles =
          result.data.map(
            (item: any) => ({
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


        candlestickSeries.setData(
          candles
        );


      } catch (error) {

        console.error(
          "Chart error:",
          error
        );

      }

    }



    // load pertama
    loadChart();



    // refresh setiap 10 detik
    const interval =
      setInterval(
        () => {
          loadChart();
        },
        10000
      );



    const resize = () => {

      if (!chartContainerRef.current) return;


      chart.applyOptions({
        width:
          chartContainerRef.current.clientWidth,
      });

    };


    window.addEventListener(
      "resize",
      resize
    );



    return () => {

      clearInterval(
        interval
      );


      window.removeEventListener(
        "resize",
        resize
      );


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
