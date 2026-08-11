"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useScheduler } from "@/context/SchedulerContext";
import type { TimeframeAnalysis } from "@/lib/engine/multiTimeframeEngine";

export default function AIBrainCard() {
  const { data, loading } = useScheduler();

  if (loading) {
    return (
      <Card title="🧠 AI Brain">
        <p className="text-slate-400">
          AI sedang menganalisa market...
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="🧠 AI Brain">
        <p className="text-red-400">
          Data AI tidak tersedia.
        </p>
      </Card>
    );
  }

  const brain = data.brain;

  return (
    <Card title="🧠 AI Brain">
      <div className="space-y-6">

        <div>
          <p className="text-sm text-slate-400">
            Symbol
          </p>

          <h2 className="text-2xl font-bold text-white">
            {data.symbol}
          </h2>
        </div>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-slate-400">
            Market Score
          </span>

          <span className="font-bold text-cyan-400">
            {brain.marketScore.technicalScore}/100
          </span>
        </div>

        <div className="border-t border-slate-800 pt-4">

          <div className="flex items-center justify-between">

            <span className="text-slate-400">
              Consensus
            </span>

            <Badge
              text={brain.consensus.action}
            />

          </div>

          <div className="mt-2 flex justify-between">

            <span className="text-slate-500">
              Score
            </span>

            <span>
              {brain.consensus.score}
            </span>

          </div>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <div className="grid grid-cols-2 gap-y-2 text-sm">

            <span>Trend</span>

            <span className="text-right text-emerald-400">
              {brain.technical.trend}
            </span>

            <span>EMA20</span>

            <span className="text-right">
              {brain.technical.ema20.toFixed(2)}
            </span>

            <span>EMA50</span>

            <span className="text-right">
              {brain.technical.ema50.toFixed(2)}
            </span>

            <span>RSI</span>

            <span className="text-right">
              {brain.technical.rsi.toFixed(2)}
            </span>

            <span>ADX</span>

            <span className="text-right">
              {brain.technical.adx.toFixed(2)}
            </span>

          </div>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <p className="mb-3 text-sm text-slate-400">
            Multi Timeframe
          </p>

          <div className="space-y-2 text-sm">

            {brain.multiTimeframe.analyses.map(
              (frame: TimeframeAnalysis) => (

                <div
                  key={frame.timeframe}
                  className="flex justify-between"
                >

                  <span>
                    {frame.timeframe}
                  </span>

                  <span
                    className={
                      frame.trend === "Bullish"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {frame.trend}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between">

          <span className="text-slate-400">
            Sentiment
          </span>

          <span className="font-bold">
            {brain.sentiment.score}
          </span>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <div className="flex justify-between">

            <span className="text-slate-400">
              Risk
            </span>

            <Badge
              text={brain.risk.level}
            />

          </div>

          <div className="mt-2 flex justify-between">

            <span className="text-slate-500">
              Risk Score
            </span>

            <span>
              {brain.risk.riskScore}
            </span>

          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between">

          <span className="text-slate-400">
            Learning Bonus
          </span>

          <span className="text-emerald-400">
            +{brain.learning.confidenceBonus}
          </span>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <div className="flex justify-between">

            <span className="text-slate-400">
              Decision
            </span>

            <Badge
              text={brain.decision.action}
            />

          </div>

          <p className="mt-3 font-bold text-emerald-400">
            Confidence {brain.decision.confidence}%
          </p>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <p className="mb-2 text-sm text-slate-400">
            AI Reasons
          </p>

          <ul className="space-y-2 text-sm text-slate-300">

            {brain.decision.reason.map(
              (item: string) => (

                <li key={item}>
                  ✔ {item}
                </li>

              )
            )}

          </ul>

        </div>

      </div>
    </Card>
  );
}