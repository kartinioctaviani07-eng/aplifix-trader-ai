"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import {
  useAIFocus,
} from "@/context/AIFocusContext";

type AnalysisResponse = {
  success: boolean;

  symbol: string;

  data: {

    symbol: string

    risk: {
      level: string;
      riskScore: number;
    };

    signal: {

      signal:
        | "BUY"
        | "SELL"
        | "WAIT";

      strength:
        | "WEAK"
        | "MEDIUM"
        | "STRONG";

      confidence: number;

      marketCondition: string;

      summary: string;

      reasons: string[];

    };

    technical: {

      indicators: {

        trend: string;

      };

      technicalScore: number;

    };

  };

};

export default function SignalCard() {

  const {
    focus,
  } = useAIFocus();

  const [
    analysis,
    setAnalysis,
  ] =
    useState<
      AnalysisResponse["data"] | null
    >(null);

  useEffect(() => {

    if (!focus)
      return;

    async function loadAnalysis() {

      try {

        const response =
          await fetch(

            `/api/analysis?symbol=${focus?.symbol ?? "BTCUSDT"}`,

            {
              cache:
                "no-store",
            }

          );

        const result:
          AnalysisResponse =
          await response.json();

        if (
          result.success
        ) {

          setAnalysis(
            result.data
          );

        }

      } catch (
        error
      ) {

        console.error(
          error
        );

      }

    }

    loadAnalysis();

    const interval =
      setInterval(
        loadAnalysis,
        30000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    focus,
  ]);

  if (
    !analysis
  ) {

    return (

      <Card title="🤖 AI Trading Signal">

        <p className="text-slate-400">
          Loading...
        </p>

      </Card>

    );

  }

  return (

    <Card title="🤖 AI Trading Signal">

      <div>

        <h2 className="text-2xl font-bold text-white">

          {analysis.symbol}

        </h2>

        <div className="mt-4 flex gap-3">

          <Badge
            text={
              analysis.signal.signal
            }
          />

          <Badge
            text={
              analysis.signal.strength
            }
          />

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            AI Confidence
          </p>

          <div className="mt-2 h-3 rounded-full bg-slate-800">

            <div

              className="h-3 rounded-full bg-emerald-500"

              style={{
                width:
                  `${analysis.signal.confidence}%`,
              }}

            />

          </div>

          <p className="mt-2 text-right text-sm text-emerald-400">

            {analysis.signal.confidence}%

          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            Market Condition
          </p>

          <p className="font-semibold text-white">

            {analysis.signal.marketCondition}

          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            Risk Level
          </p>

          <p className="font-semibold text-white">

            {analysis.risk.level}

          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            AI Summary
          </p>

          <p className="mt-2 text-sm text-slate-300">

            {analysis.signal.summary}

          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            AI Reason
          </p>

          {

            analysis.signal.reasons.length === 0

            ?

            <p className="mt-2 text-sm text-slate-500">

              Tidak ada alasan tambahan.

            </p>

            :

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">

              {

                analysis.signal.reasons.map(
                  (
                    item
                  ) => (

                    <li key={item}>
                      {item}
                    </li>

                  )
                )

              }

            </ul>

          }

        </div>

      </div>

    </Card>

  );

}
