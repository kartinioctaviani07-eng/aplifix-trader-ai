import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-lg font-bold text-emerald-400">
                  A
                </span>
              </div>

              <div>
                <p className="font-bold tracking-tight text-white">
                  APLIFIX
                </p>

                <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  Digital Intelligence
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              PT APLIFIX DIGITAL INDONESIA membangun software,
              artificial intelligence, trading intelligence, dan
              sistem digital yang dikembangkan secara bertahap.
            </p>

            <p className="mt-4 text-sm font-medium text-slate-400">
              Building Intelligent Digital Systems
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Company
            </p>

            <div className="mt-4 space-y-3">
              <Link
                href="/"
                className="block text-sm text-slate-500 transition hover:text-emerald-400"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="block text-sm text-slate-500 transition hover:text-emerald-400"
              >
                About APLIFIX
              </Link>

              <a
                href="mailto:aplifixdigitalindonesia@gmail.com"
                className="block text-sm text-slate-500 transition hover:text-emerald-400"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Products
            </p>

            <div className="mt-4 space-y-3">
              <Link
                href="/"
                className="block text-sm text-slate-500 transition hover:text-emerald-400"
              >
                APLIFIX Trader AI
              </Link>

              <p className="text-sm text-slate-600">
                AI & Digital Systems
              </p>

              <p className="text-sm text-slate-600">
                Trading Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PT APLIFIX DIGITAL INDONESIA.
            All rights reserved.
          </p>

          <p>
            Bandung, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
