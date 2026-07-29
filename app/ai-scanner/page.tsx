import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";


const scans = [
  {
    pair: "BTCUSDT",
    score: "92/100",
    trend: "Bullish",
    signal: "BUY",
    analysis: "Strong momentum and increasing trading volume detected.",
  },
  {
    pair: "ETHUSDT",
    score: "76/100",
    trend: "Neutral",
    signal: "HOLD",
    analysis: "Market consolidation detected. Waiting for confirmation.",
  },
  {
    pair: "SOLUSDT",
    score: "65/100",
    trend: "Bearish",
    signal: "SELL",
    analysis: "Selling pressure increasing in current market condition.",
  },
];


export default function AIScannerPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        AI Scanner
      </h1>

      <p className="mt-2 text-slate-400">
        Intelligent market scanning powered by AI
      </p>



      <div className="mt-8 grid gap-6">


        {scans.map((scan) => (

          <Card
            key={scan.pair}
            title={`🔎 ${scan.pair}`}
          >

            <div className="grid grid-cols-2 gap-6">


              <div>
                <p className="text-sm text-slate-400">
                  AI Score
                </p>

                <p className="text-2xl font-bold text-emerald-400">
                  {scan.score}
                </p>
              </div>



              <div>
                <p className="text-sm text-slate-400">
                  Signal
                </p>

                <Badge text={scan.signal} />
              </div>



              <div>
                <p className="text-sm text-slate-400">
                  Trend
                </p>

                <p className="font-bold text-white">
                  {scan.trend}
                </p>
              </div>


              <div>
                <p className="text-sm text-slate-400">
                  Analysis
                </p>

                <p className="text-slate-300">
                  {scan.analysis}
                </p>
              </div>


            </div>


          </Card>

        ))}


      </div>


    </main>
  );
}
