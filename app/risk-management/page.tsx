import Link from "next/link";
import Card from "@/components/ui/Card";


export default function RiskManagementPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">


      <Link
        href="/"
        className="mb-6 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
      >
        ← Back to Dashboard
      </Link>



      <h1 className="text-3xl font-bold text-white">
        Risk Management
      </h1>

      <p className="mt-2 text-slate-400">
        Manage trading risk and position sizing
      </p>



      <div className="mt-8 grid grid-cols-3 gap-6">


        <Card title="Account Balance">

          <h2 className="text-3xl font-bold text-white">
            Rp 10.000.000
          </h2>

        </Card>



        <Card title="Risk Per Trade">

          <h2 className="text-3xl font-bold text-yellow-400">
            2%
          </h2>

        </Card>



        <Card title="Maximum Loss">

          <h2 className="text-3xl font-bold text-red-400">
            Rp 200.000
          </h2>

        </Card>


      </div>




      <div className="mt-8">

        <Card title="BTCUSDT Risk Calculator">


          <div className="grid grid-cols-2 gap-6">


            <div>
              <p className="text-sm text-slate-400">
                Entry Price
              </p>

              <p className="text-xl font-bold text-white">
                $68,500
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Stop Loss
              </p>

              <p className="text-xl font-bold text-red-400">
                $67,000
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Take Profit
              </p>

              <p className="text-xl font-bold text-emerald-400">
                $72,000
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-400">
                Risk Reward Ratio
              </p>

              <p className="text-xl font-bold text-white">
                1 : 2.3
              </p>
            </div>


          </div>


        </Card>


      </div>



    </main>
  );
}
