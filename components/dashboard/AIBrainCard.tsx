"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import {
  useScheduler,
} from "@/context/SchedulerContext";

export default function AIBrainCard() {

  const {

    data,

    loading,

  } = useScheduler();

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

  const brain =
    data.brain;

  return (

    <Card title="🧠 AI Brain">

      <div className="space-y-5">

        <div>

          <p className="text-sm text-slate-400">
            Symbol
          </p>

          <h2 className="text-2xl font-bold text-white">

            {data.symbol}

          </h2>

        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">

          <span>Trend</span>

          <span className="text-right text-emerald-400">

            {brain.technical.trend}

          </span>

          <span>EMA 20</span>

          <span className="text-right">

            {brain.technical.ema20.toFixed(2)}

          </span>

          <span>EMA 50</span>

          <span className="text-right">

            {brain.technical.ema50.toFixed(2)}

          </span>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <p className="text-sm text-slate-400">
            Risk
          </p>

          <Badge
            text={brain.risk.level}
          />

          <p className="mt-2 text-sm">

            Score {brain.risk.riskScore}

          </p>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <p className="text-sm text-slate-400">

            AI Decision

          </p>

          <Badge
            text={brain.decision.action}
          />

          <p className="mt-3 font-bold text-emerald-400">

            Confidence {brain.decision.confidence}%

          </p>

        </div>

        <div className="border-t border-slate-800 pt-4">

          <p className="text-sm text-slate-400">

            Reason

          </p>

          <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">

            {

              brain.decision.reason.map(

                (item: string) => (

                  <li key={item}>

                    {item}

                  </li>

                )

              )

            }

          </ul>

        </div>

      </div>

    </Card>

  );

}
