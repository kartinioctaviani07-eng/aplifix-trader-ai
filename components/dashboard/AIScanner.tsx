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

export default function AIScanner() {
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
      <Card title="🤖 AI Market Scanner">
        <p className="text-slate-400">
          Loading...
        </p>
      </Card>
    );
  }

  return (
    <Card title="🤖 AI Market Scanner">

      <div className="space-y-5">

        <div>

          <p className="text-sm text-slate-400">
            Trading Pair
          </p>

          <h2 className="text-2xl font-bold text-white">
            {analysis.symbol}
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-sm text-slate-400">
              Market Trend
            </p>

            <p className="font-bold text-emerald-400">
              {analysis.technical.indicators.trend}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-400">
              Technical Score
            </p>

            <p className="font-bold text-cyan-400">
              {analysis.technical.technicalScore}
            </p>

          </div>

        </div>

        <div>

          <p className="text-sm text-slate-400">
            AI Recommendation
          </p>

          <div className="mt-2">
            <Badge
              text={analysis.decision.action}
            />
          </div>

        </div>

        <div>

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

          <p className="mt-2 text-right text-emerald-400">
            {analysis.decision.confidence}%
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">
            Analysis
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">

            {analysis.decision.reason.map(
              (reason) => (
                <li key={reason}>
                  {reason}
                </li>
              )
            )}

          </ul>

        </div>

      </div>

    </Card>
  );
}
