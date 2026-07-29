import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";


const markets = [
  {
    name: "BTCUSDT",
    price: "$68,500",
    change: "+2.45%",
    trend: "Bullish",
  },
  {
    name: "ETHUSDT",
    price: "$3,450",
    change: "+1.20%",
    trend: "Neutral",
  },
  {
    name: "SOLUSDT",
    price: "$180",
    change: "-0.50%",
    trend: "Bearish",
  },
];


export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>


      <h1 className="text-3xl font-bold text-white">
        Markets
      </h1>

      <p className="mt-2 text-slate-400">
        Cryptocurrency market overview powered by AI
      </p>



      <div className="mt-8 grid gap-6">


        {markets.map((market) => (

          <Card
            key={market.name}
            title={market.name}
          >

            <div className="grid grid-cols-3 items-center gap-4">


              <div>
                <p className="text-sm text-slate-400">
                  Price
                </p>

                <p className="text-xl font-bold text-white">
                  {market.price}
                </p>
              </div>


              <div>
                <p className="text-sm text-slate-400">
                  Change
                </p>

                <p className="font-bold text-emerald-400">
                  {market.change}
                </p>
              </div>


              <div>
                <p className="text-sm text-slate-400">
                  AI Trend
                </p>

                <Badge text={market.trend} />
              </div>


            </div>


          </Card>

        ))}


      </div>


    </main>
  );
}
