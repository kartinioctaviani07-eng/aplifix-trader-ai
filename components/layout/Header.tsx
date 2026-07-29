export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-5">

      <div>
        <h1 className="text-xl font-bold text-white">
          APLIFIX AI
        </h1>

        <p className="text-sm text-slate-400">
          Trader Intelligence Platform
        </p>
      </div>


      <div className="flex items-center gap-6">


        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">

          <p className="text-xs text-slate-400">
            AI Engine
          </p>

          <p className="font-semibold text-emerald-400">
            ● Online
          </p>

        </div>


        <div className="rounded-xl border border-slate-800 px-4 py-2">

          <p className="text-xs text-slate-400">
            Market Status
          </p>

          <p className="font-semibold text-white">
            Active
          </p>

        </div>


        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">

          <span className="font-bold text-white">
            AI
          </span>

        </div>


      </div>


    </header>
  );
}
