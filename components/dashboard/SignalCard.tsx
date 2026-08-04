"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import {
  useScheduler,
} from "@/context/SchedulerContext";

export default function SignalCard() {

  const {
    data,
    loading,
  } = useScheduler();

  if (loading || !data) {

    return (

      <Card title="🤖 AI Trading Signal">

        <p className="text-slate-400">
          Loading AI...
        </p>

      </Card>

    );

  }

  const decision =
    data.brain.decision;

  return (

    <Card title="🤖 AI Trading Signal">

      <div className="space-y-5">

        <div>

          <h2 className="text-2xl font-bold text-white">

            {data.symbol}

          </h2>

        </div>

        <div className="flex gap-3">

          <Badge text={decision.action} />

          <Badge text={data.brain.risk.level} />

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Confidence

          </p>

          <div className="mt-2 h-3 rounded-full bg-slate-800">

            <div

              className="h-3 rounded-full bg-emerald-500"

              style={{

                width:
                  `${decision.confidence}%`,

              }}

            />

          </div>

          <p className="mt-2 text-right text-sm text-emerald-400">

            {decision.confidence}%

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            AI Score

          </p>

          <p className="font-bold text-white">

            {decision.totalScore}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Reason

          </p>

          <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">

            {decision.reason.map((item: string) => (

              <li key={item}>
                {item}
              </li>

            ))}

          </ul>

        </div>

      </div>

    </Card>

  );

}
