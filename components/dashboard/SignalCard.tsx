"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type AnalysisResponse = {
  success: boolean;
  data: {
    symbol: string;

    technical: {
      indicators: {
        trend: string;
      };

      technicalScore: number;
    };

    decision: {
      action: string;
      confidence: number;
      reason: string[];
    };
  };
};

export default function SignalCard() {
  const [analysis, setAnalysis] =
    useState<AnalysisResponse["data"] | null>(null);

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const response =
          await fetch("/api/analysis", {
            cache: "no-store",
          });

        const result: AnalysisResponse =
          await response.json();

        if (result.success) {
          setAnalysis(result.data);
        }

      } catch (error) {
        console.error(error);
      }
    }

    loadAnalysis();

    const interval =
      setInterval(loadAnalysis, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  if (!analysis) {
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

        <div className="mt-4">
          <Badge
            text={analysis.decision.action}
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
                width: `${analysis.decision.confidence}%`,
              }}
            />

          </div>

          <p className="mt-2 text-right text-sm text-emerald-400">
            {analysis.decision.confidence}%
          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            Trend
          </p>

          <p className="font-semibold text-white">
            {analysis.technical.indicators.trend}
          </p>

        </div>

        <div className="mt-6">

          <p className="text-sm text-slate-400">
            AI Reason
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">

            {analysis.decision.reason.map(
              (item) => (
                <li key={item}>
                  {item}
                </li>
              )
            )}

          </ul>

        </div>

      </div>

    </Card>
  );
}
