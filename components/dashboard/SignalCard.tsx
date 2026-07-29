import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function SignalCard() {
  return (
    <Card title="🤖 AI Trading Signal">

      <div>
        <h2 className="text-2xl font-bold text-white">
          BTC / USDT
        </h2>

        <div className="mt-4">
          <Badge text="BUY" />
        </div>


        <div className="mt-6">

          <p className="text-sm text-slate-400">
            AI Confidence
          </p>

          <div className="mt-2 h-3 rounded-full bg-slate-800">
            <div
              className="h-3 rounded-full bg-emerald-500"
              style={{ width: "87%" }}
            />
          </div>

          <p className="mt-2 text-right text-sm text-emerald-400">
            87%
          </p>

        </div>


        <div className="mt-6 grid grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-slate-400">
              Trend
            </p>
            <p className="font-semibold text-white">
              Bullish
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-400">
              Risk
            </p>
            <p className="font-semibold text-yellow-400">
              Medium
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-400">
              Entry
            </p>
            <p className="font-semibold text-white">
              $68,500
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-400">
              Target
            </p>
            <p className="font-semibold text-emerald-400">
              $71,000
            </p>
          </div>


        </div>


      </div>

    </Card>
  );
}
