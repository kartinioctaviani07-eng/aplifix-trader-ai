import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AIScanner() {
  return (
    <Card title="🤖 AI Market Scanner">

      <div className="space-y-5">


        <div>
          <p className="text-sm text-slate-400">
            Trading Pair
          </p>

          <h2 className="text-2xl font-bold text-white">
            BTCUSDT
          </h2>
        </div>


        <div className="grid grid-cols-2 gap-4">


          <div>
            <p className="text-sm text-slate-400">
              Market Trend
            </p>

            <p className="font-bold text-emerald-400">
              Bullish
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-400">
              Risk Level
            </p>

            <p className="font-bold text-yellow-400">
              Medium
            </p>
          </div>


        </div>


        <div>
          <p className="text-sm text-slate-400">
            AI Recommendation
          </p>

          <div className="mt-2">
            <Badge text="BUY" />
          </div>
        </div>


        <div>

          <p className="text-sm text-slate-400">
            AI Confidence
          </p>

          <div className="mt-2 h-3 rounded-full bg-slate-800">

            <div
              className="h-3 rounded-full bg-emerald-500"
              style={{ width: "87%" }}
            />

          </div>


          <p className="mt-2 text-right text-emerald-400">
            87%
          </p>

        </div>


        <div>

          <p className="text-sm text-slate-400">
            Analysis
          </p>

          <p className="mt-1 text-slate-300">
            Strong buying momentum detected.
            Market structure menunjukkan peluang naik.
          </p>

        </div>


      </div>


    </Card>
  );
}
