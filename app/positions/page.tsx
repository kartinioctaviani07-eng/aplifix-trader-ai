import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";


const positions = [
  {
    pair: "BTCUSDT",
    side: "BUY",
    entry: "$68,500",
    current: "$69,200",
    stopLoss: "$67,000",
    takeProfit: "$72,000",
    profit: "+1.02%",
  },
  {
    pair: "ETHUSDT",
    side: "SELL",
    entry: "$3,500",
    current: "$3,450",
    stopLoss: "$3,600",
    takeProfit: "$3,200",
    profit: "+1.40%",
  },
];


export default function PositionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        Positions
      </h1>

      <p className="mt-2 text-slate-400">
        Monitor your active trading positions
      </p>



      <div className="mt-8 grid gap-6">


        {positions.map((position) => (

          <Card
            key={position.pair}
            title={position.pair}
          >


            <div className="grid grid-cols-3 gap-6">


              <div>

                <p className="text-sm text-slate-400">
                  Side
                </p>

                <div className="mt-2">
                  <Badge text={position.side} />
                </div>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Entry Price
                </p>

                <p className="font-bold text-white">
                  {position.entry}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Current Price
                </p>

                <p className="font-bold text-white">
                  {position.current}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Stop Loss
                </p>

                <p className="font-bold text-red-400">
                  {position.stopLoss}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Take Profit
                </p>

                <p className="font-bold text-emerald-400">
                  {position.takeProfit}
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  P/L
                </p>

                <p className="font-bold text-emerald-400">
                  {position.profit}
                </p>

              </div>


            </div>


          </Card>

        ))}


      </div>


    </main>
  );
}
