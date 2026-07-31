"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";


type Memory = {
  id: string;
  symbol: string;
  action: string;
  confidence: number;
  reason: string[];
  timestamp: number;
};


export default function AIHistory() {


  const [history,setHistory] =
    useState<Memory[]>([]);



  useEffect(()=>{


    async function load(){

      const res =
        await fetch(
          "/api/ai-memory",
          {
            cache:"no-store"
          }
        );


      const json =
        await res.json();


      if(json.success){

        setHistory(
          json.history.slice(0,5)
        );

      }

    }


    load();


    const timer =
      setInterval(
        load,
        10000
      );


    return ()=>clearInterval(timer);


  },[]);



  return (

    <Card title="🧠 AI Decision History">


      <div className="space-y-4">


      {
        history.map(
          (item)=>(

          <div
            key={item.id}
            className="
            border
            border-slate-800
            rounded-xl
            p-4
            "
          >

            <div
            className="
            flex
            justify-between
            "
            >

              <div
              className="font-bold text-white"
              >
                {item.symbol}
              </div>


              <div
              className="text-emerald-400 font-bold"
              >
                {item.action}
              </div>


            </div>



            <div
            className="
            text-sm
            text-slate-400
            mt-2
            "
            >

              Confidence:
              {" "}
              {item.confidence}%

            </div>



            <div
            className="
            mt-2
            text-sm
            text-slate-300
            "
            >

              {item.reason[0]}

            </div>


          </div>

          )
        )
      }


      </div>


    </Card>

  );

}
