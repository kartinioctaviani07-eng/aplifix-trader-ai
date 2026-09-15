import Link from "next/link";
import Card from "@/components/ui/Card";


const results = [
  {
    strategy: "AI Momentum Strategy",
    pair: "BTCUSDT",
    period: "30 Days",
    profit: "+25%",
    winRate: "78%",
    trades: "50",
  },
  {
    strategy: "AI Trend Following",
    pair: "ETHUSDT",
    period: "30 Days",
    profit: "+18%",
    winRate: "72%",
    trades: "42",
  },
];


export default function BacktestPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/trader"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        Backtest
      </h1>

      <p className="mt-2 text-slate-400">
        Test AI trading strategy performance using historical data
      </p>



      <div className="mt-8 grid grid-cols-3 gap-6">


        <Card title="Initial Balance">

          <h2 className="text-3xl font-bold text-white">
            Rp 10.000.000
          </h2>

        </Card>



        <Card title="Final Balance">

          <h2 className="text-3xl font-bold text-emerald-400">
            Rp 12.500.000
          </h2>

        </Card>



        <Card title="Total Profit">

          <h2 className="text-3xl font-bold text-emerald-400">
            +25%
          </h2>

        </Card>


      </div>




      <div className="mt-8">

        <Card title="Strategy Results">


          <div className="space-y-4">


            {results.map((result) => (

              <div
                key={result.strategy}
                className="rounded-xl border border-slate-800 p-5"
              >


                <h3 className="text-lg font-bold text-white">
                  {result.strategy}
                </h3>


                <div className="mt-4 grid grid-cols-5 gap-4">


                  <div>
                    <p className="text-sm text-slate-400">
                      Pair
                    </p>

                    <p className="font-bold text-white">
                      {result.pair}
                    </p>
                  </div>



                  <div>
                    <p className="text-sm text-slate-400">
                      Period
                    </p>

                    <p className="font-bold text-white">
                      {result.period}
                    </p>
                  </div>



                  <div>
                    <p className="text-sm text-slate-400">
                      Profit
                    </p>

                    <p className="font-bold text-emerald-400">
                      {result.profit}
                    </p>
                  </div>



                  <div>
                    <p className="text-sm text-slate-400">
                      Win Rate
                    </p>

                    <p className="font-bold text-white">
                      {result.winRate}
                    </p>
                  </div>



                  <div>
                    <p className="text-sm text-slate-400">
                      Trades
                    </p>

                    <p className="font-bold text-white">
                      {result.trades}
                    </p>
                  </div>


                </div>


              </div>

            ))}


          </div>


        </Card>


      </div>


    </main>
  );
}
