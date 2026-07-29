import Link from "next/link";
import Card from "@/components/ui/Card";


const assets = [
  {
    name: "BTC",
    amount: "0.05 BTC",
    value: "Rp 50.000.000",
    change: "+2.45%",
  },
  {
    name: "ETH",
    amount: "2 ETH",
    value: "Rp 20.000.000",
    change: "+1.20%",
  },
  {
    name: "SOL",
    amount: "10 SOL",
    value: "Rp 18.000.000",
    change: "-0.50%",
  },
];


export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="inline-block mb-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        Portfolio
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your digital assets and trading positions
      </p>



      <div className="mt-8 grid grid-cols-3 gap-6">


        <Card title="Total Portfolio">

          <h2 className="text-3xl font-bold text-white">
            Rp 88.000.000
          </h2>

        </Card>



        <Card title="Today's Profit">

          <h2 className="text-3xl font-bold text-emerald-400">
            + Rp 250.000
          </h2>

        </Card>



        <Card title="Active Positions">

          <h2 className="text-3xl font-bold text-white">
            3
          </h2>

        </Card>


      </div>




      <div className="mt-8">

        <Card title="Assets">


          <div className="space-y-4">


            {assets.map((asset) => (

              <div
                key={asset.name}
                className="flex items-center justify-between rounded-xl border border-slate-800 p-4"
              >

                <div>

                  <h3 className="font-bold text-white">
                    {asset.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {asset.amount}
                  </p>

                </div>



                <div className="text-right">

                  <p className="font-bold text-white">
                    {asset.value}
                  </p>

                  <p className="text-emerald-400">
                    {asset.change}
                  </p>

                </div>


              </div>

            ))}


          </div>


        </Card>

      </div>





      <div className="mt-8">

        <Card title="Open Positions">


          <div className="rounded-xl border border-slate-800 p-5">


            <h3 className="font-bold text-white">
              BTCUSDT
            </h3>


            <div className="mt-4 grid grid-cols-3 gap-4">


              <div>

                <p className="text-sm text-slate-400">
                  Side
                </p>

                <p className="font-bold text-emerald-400">
                  BUY
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  Entry
                </p>

                <p className="font-bold text-white">
                  $68,500
                </p>

              </div>



              <div>

                <p className="text-sm text-slate-400">
                  P/L
                </p>

                <p className="font-bold text-emerald-400">
                  +1.02%
                </p>

              </div>


            </div>


          </div>


        </Card>


      </div>



    </main>
  );
}
