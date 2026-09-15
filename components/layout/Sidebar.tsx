import Link from "next/link";

const menuClass =
  "block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white";

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <span className="text-lg font-bold text-emerald-400">A</span>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              APLIFIX
            </h2>

            <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
              Digital Intelligence
            </p>
          </div>
        </div>

        <div className="mt-4 border-l-2 border-slate-800 pl-3">
          <p className="text-xs font-medium leading-relaxed text-slate-400">
            PT APLIFIX DIGITAL INDONESIA
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Bandung, Indonesia
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>

          <Link href="/trader" className={menuClass}>
            Dashboard
          </Link>
        </div>

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trading
          </p>

          <ul className="space-y-2">
            <li>
              <Link href="/markets" className={menuClass}>
                Markets
              </Link>
            </li>

            <li>
              <Link href="/ai-signals" className={menuClass}>
                AI Signals
              </Link>
            </li>

            <li>
              <Link href="/portfolio" className={menuClass}>
                Portfolio
              </Link>
            </li>

            <li>
              <Link href="/positions" className={menuClass}>
                Positions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Analysis
          </p>

          <ul className="space-y-2">
            <li>
              <Link href="/ai-scanner" className={menuClass}>
                AI Scanner
              </Link>
            </li>

            <li>
              <Link href="/backtest" className={menuClass}>
                Backtest
              </Link>
            </li>

            <li>
              <Link href="/risk-management" className={menuClass}>
                Risk Management
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            System
          </p>

          <Link href="#" className={menuClass}>
            Settings
          </Link>
        </div>
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Company Status
          </p>

          <span className="text-xs text-slate-600">
            APLIFIX
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs text-slate-500">
              Capital
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Rp 10.000.000
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Today P/L
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              Rp 0
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
            <span className="text-xs text-slate-500">
              AI System
            </span>

            <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Operational
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 px-1">
        <p className="text-[11px] leading-relaxed text-slate-600">
          Building intelligent digital systems.
        </p>
      </div>
    </aside>
  );
}
