"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type Analysis = {
  provider: string;
  symbol: string;
  candles: number;

  technical: {
    indicators: {
      trend: string;
    };

    rsi: {
      value: number;
      status: string;
    };

    macd: {
      macd: number;
      trend: string;
    };

    atr: {
      value: number;
      volatility: string;
    };

    technicalScore: number;
  };

  marketScores: {
    newsScore: number;
    sentimentScore: number;
    newsProvider: string;
    totalNews: number;
  };

  risk: {
    riskScore: number;
    level: string;
  };

  decision: {
    action: string;
    confidence: number;
  };

  signal: {
    signal: string;
    strength: string;
    confidence: number;
    marketCondition: string;
    summary: string;
    reasons: string[];
  };
};


export default function AIScanner() {

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);


  useEffect(() => {

    async function load() {

      const res =
        await fetch(
          "/api/analysis",
          {
            cache: "no-store",
          }
        );

      const json =
        await res.json();

      if (json.success) {
        setAnalysis(json.data);
      }

    }


    load();


    const timer =
      setInterval(
        load,
        60000
      );


    return () =>
      clearInterval(timer);


  }, []);


  if (!analysis) {

    return (
      <Card title="🤖 AI Scanner">
        Loading...
      </Card>
    );

  }


  return (

    <Card title="🤖 AI Scanner">

      <div className="space-y-5">


        <div>
          <p className="text-sm text-slate-400">
            Trading Pair
          </p>

          <h2 className="text-2xl font-bold">
            {analysis.symbol}
          </h2>
        </div>


        <div className="grid grid-cols-2 gap-3 text-sm">

          <span>Provider</span>
          <span className="text-right">
            {analysis.provider}
          </span>


          <span>Candles</span>
          <span className="text-right">
            {analysis.candles}
          </span>


          <span>Trend</span>
          <span className="text-right">
            {analysis.technical.indicators.trend}
          </span>


          <span>RSI</span>
          <span className="text-right">
            {analysis.technical.rsi.value}
          </span>


          <span>MACD</span>
          <span className="text-right">
            {analysis.technical.macd.macd}
          </span>


          <span>ATR</span>
          <span className="text-right">
            {analysis.technical.atr.value}
          </span>


          <span>Volatility</span>
          <span className="text-right">
            {analysis.technical.atr.volatility}
          </span>


          <span>Technical Score</span>
          <span className="text-right">
            {analysis.technical.technicalScore}
          </span>

        </div>


        <div className="border-t border-slate-800 pt-4">

          <p className="text-sm text-slate-400">
            AI Signal
          </p>

          <Badge
            text={analysis.signal.signal}
          />

        </div>


        <div className="grid grid-cols-2 gap-3 text-sm">

          <span>Strength</span>
          <span className="text-right">
            {analysis.signal.strength}
          </span>


          <span>Confidence</span>
          <span className="text-right text-emerald-400">
            {analysis.signal.confidence}%
          </span>


          <span>Market Condition</span>
          <span className="text-right">
            {analysis.signal.marketCondition}
          </span>

        </div>


        <div>

          <p className="text-sm text-slate-400">
            AI Summary
          </p>

          <p className="mt-2">
            {analysis.signal.summary}
          </p>

        </div>


        <div>

          <p className="text-sm text-slate-400">
            AI Reason
          </p>

          <ul className="list-disc pl-5">

            {analysis.signal.reasons.map(
              (item) => (
                <li key={item}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>


        <div className="border-t border-slate-800 pt-4">

          <p>
            📰 News Score:
            {" "}
            {analysis.marketScores.newsScore}
          </p>

          <p>
            Sentiment:
            {" "}
            {analysis.marketScores.sentimentScore}
          </p>

          <p>
            Provider:
            {" "}
            {analysis.marketScores.newsProvider}
          </p>

        </div>


        <div className="border-t border-slate-800 pt-4">

          <p>
            🛡 Risk Score:
            {" "}
            {analysis.risk.riskScore}
          </p>

          <p>
            Level:
            {" "}
            {analysis.risk.level}
          </p>

        </div>


      </div>

    </Card>

  );

}
