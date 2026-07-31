"use client";

import {
  useEffect,
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


type MarketResponse = {
  success: boolean;
  data: MarketData;
};


export default function MarketCard() {

  const {
    focus,
  } = useAIFocus();


  const [market, setMarket] =
    useState<MarketData | null>(null);



  useEffect(() => {


    async function loadMarket() {


      try {


        const symbol =
          focus?.symbol ??
          "BTCUSDT";


        const response =
          await fetch(
            `/api/market?symbol=${symbol}`,
            {
              cache:
                "no-store",
            }
          );


        const result:
          MarketResponse =
          await response.json();



        if (result.success) {

          setMarket(
            result.data
          );

        }


      } catch(error) {


        console.error(
          "Market fetch error:",
          error
        );


      }


    }



    loadMarket();



    const interval =
      setInterval(
        loadMarket,
        30000
      );



    return () =>
      clearInterval(
        interval
      );



  }, [focus]);



  if (!market) {


    return (

      <Card title="Market Overview">


        <p className="text-slate-400">

          Loading market data...

        </p>


      </Card>

    );


  }




  return (

    <Card title="Market Overview">


      <div className="flex items-center justify-between">


        <div>


          <h2 className="text-2xl font-bold text-white">

            {market.symbol}

          </h2>


          <p className="mt-1 text-sm text-slate-400">

            AI Focus Market

          </p>


        </div>




        <div>


          <p className="text-2xl font-bold text-white">


            $

            {market.price.toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 2,
              }
            )}


          </p>



          <p className="text-right text-emerald-400">


            {market.changePercent > 0 ? "+" : ""}

            {market.changePercent}%


          </p>


        </div>


      </div>




      <div className="mt-6 grid grid-cols-3 gap-4">


        <div>

          <p className="text-sm text-slate-400">

            High

          </p>


          <p className="font-semibold text-white">

            $

            {market.high.toLocaleString()}

          </p>


        </div>





        <div>

          <p className="text-sm text-slate-400">

            Low

          </p>


          <p className="font-semibold text-white">

            $

            {market.low.toLocaleString()}

          </p>


        </div>





        <div>

          <p className="text-sm text-slate-400">

            Volume

          </p>


          <p className="font-semibold text-white">

            {market.volume.toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 2,
              }
            )}

          </p>


        </div>


      </div>


    </Card>

  );

}
