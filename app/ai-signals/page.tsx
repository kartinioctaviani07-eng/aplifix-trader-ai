import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";


const signals = [
  {
    pair: "BTCUSDT",
    recommendation: "BUY",
    confidence: "87%",
    trend: "Bullish",
    risk: "Medium",
    analysis:
      "Strong buying momentum detected. Volume meningkat dan trend masih positif.",
  },
  {
    pair: "ETHUSDT",
    recommendation: "HOLD",
    confidence: "72%",
    trend: "Neutral",
    risk: "Low",
    analysis:
      "Market sedang konsolidasi. Menunggu konfirmasi arah berikutnya.",
  },
  {
    pair: "SOLUSDT",
    recommendation: "SELL",
    confidence: "78%",
    trend: "Bearish",
    risk: "High",
    analysis:
      "Tekanan jual meningkat. Momentum bearish mulai terlihat.",
  },
];


export default function AISignalsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        AI Signals
      </h1>

      <p className="mt-2 text-slate-400">
        AI powered market prediction and trading analysis
      </p>



      <div className="mt-8 grid gap-6">


        {signals.map((signal) => (

          <Card
            key={signal.pair}
            title={`🤖 ${signal.pair}`}
          >


            <div className="grid grid-cols-2 gap-6">


              <div>

                <p className="text-sm text-slate-400">
                  Recommendation
                </p>

                <div className="mt-2">
                  <Badge text={signal.recommendation} />
                </div>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  AI Confidence
                </p>

                <p className="text-xl font-bold text-emerald-400">
                  {signal.confidence}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Trend
                </p>

                <p className="font-bold text-white">
                  {signal.trend}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Risk Level
                </p>

                <p className="font-bold text-yellow-400">
                  {signal.risk}
                </p>

              </div>


            </div>



            <div className="mt-6">

              <p className="text-sm text-slate-400">
                AI Analysis
              </p>

              <p className="mt-2 text-slate-300">
                {signal.analysis}
              </p>

            </div>


          </Card>

        ))}


      </div>


    </main>
  );
}
