import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950 p-6">

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">
          APLIFIX AI
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Trader Intelligence
        </p>
      </div>


      <nav className="space-y-6">


        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
            Main
          </p>

          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>
        </div>



        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
            Trading
          </p>

          <ul className="space-y-2">

            <li>
              <Link
                href="/markets"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Markets
              </Link>
            </li>


            <li>
              <Link
                href="/ai-signals"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                AI Signals
              </Link>
            </li>


            <li>
              <Link
                href="/portfolio"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Portfolio
              </Link>
            </li>


            <li>
              <Link
                href="/positions"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Positions
              </Link>
            </li>

          </ul>

        </div>




        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
            Analysis
          </p>


          <ul className="space-y-2">


            <li>
              <Link
                href="/ai-scanner"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                AI Scanner
              </Link>
            </li>


            <li>
              <Link
                href="/backtest"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Backtest
              </Link>
            </li>


            <li>
              <Link
                href="/risk-management"
                className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Risk Management
              </Link>
            </li>


          </ul>

        </div>




        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
            System
          </p>


          <Link
            href="#"
            className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Settings
          </Link>


        </div>


      </nav>


    </aside>
  );
}
