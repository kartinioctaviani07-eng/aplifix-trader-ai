import Link from "next/link";

import MiniMarketChart from "@/components/public/MiniMarketChart";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "About | APLIFIX DIGITAL INDONESIA",
  description:
    "Mengenal PT APLIFIX DIGITAL INDONESIA dan teknologi digital yang sedang kami bangun.",
};

const focusAreas = [
  {
    title: "Artificial Intelligence",
    description:
      "Mengembangkan sistem berbasis AI untuk membantu proses analisis, pengambilan keputusan, dan otomatisasi.",
  },
  {
    title: "Trading Intelligence",
    description:
      "Membangun teknologi yang menggabungkan market data, AI analysis, risk management, dan decision systems.",
  },
  {
    title: "Digital Software",
    description:
      "Membangun aplikasi digital yang dirancang untuk menyelesaikan kebutuhan nyata dan dapat dikembangkan secara berkelanjutan.",
  },
  {
    title: "Intelligent Systems",
    description:
      "Mengembangkan sistem digital yang tidak hanya menampilkan data, tetapi mampu mengolah informasi menjadi insight yang lebih berguna.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <header className="border-b border-slate-800 pb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            ← Back to APLIFIX
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                PT APLIFIX DIGITAL INDONESIA
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Building Intelligent
                <span className="block text-emerald-400">
                  Digital Systems
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                APLIFIX DIGITAL INDONESIA adalah perusahaan teknologi
                yang berfokus pada pengembangan software digital,
                artificial intelligence, trading intelligence, dan
                sistem digital yang terus dikembangkan secara bertahap.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300">
                  Artificial Intelligence
                </span>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300">
                  Trading Intelligence
                </span>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300">
                  Digital Systems
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
              <div className="border-b border-slate-800 bg-slate-950/70 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      APLIFIX Intelligence
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Live Market Intelligence
                    </p>
                  </div>

                  <span className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
              </div>

              <div className="flex h-[260px] items-center justify-center px-4 py-3">
                <div className="w-full max-w-[560px]">
                  <MiniMarketChart symbol="BTCUSDT" />
                </div>
              </div>

              <div className="border-t border-slate-800 px-5 py-3">
                <p className="text-xs text-slate-500">
                  Real-time market visualization from APLIFIX Trader AI.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-10 border-b border-slate-800 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              About APLIFIX
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Membangun teknologi dari pondasi
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-400">
              <p>
                APLIFIX DIGITAL INDONESIA dibangun dengan visi untuk
                menciptakan produk dan sistem digital yang memiliki
                manfaat nyata serta dapat berkembang seiring waktu.
              </p>

              <p>
                Kami percaya bahwa teknologi yang baik tidak hanya
                terlihat modern, tetapi juga memiliki struktur yang
                jelas, dapat dipelihara, dan mampu berkembang mengikuti
                kebutuhan penggunanya.
              </p>

              <p>
                Karena itu, setiap produk APLIFIX dikembangkan secara
                bertahap, mulai dari membangun pondasi teknologi,
                menguji sistem, hingga mengembangkan fitur yang lebih
                kompleks.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Company
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-slate-500">
                  Legal Name
                </p>

                <p className="mt-1 font-semibold text-white">
                  PT APLIFIX DIGITAL INDONESIA
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-white">
                  Bandung, Indonesia
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Focus
                </p>

                <p className="mt-1 font-semibold text-white">
                  AI & Digital Systems
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Our Focus
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Teknologi yang sedang kami bangun
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Beberapa area yang menjadi fokus pengembangan APLIFIX.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  A
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {area.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-800 py-16">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Featured Project
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              APLIFIX Trader AI
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-slate-400">
              APLIFIX Trader AI merupakan salah satu proyek teknologi
              yang sedang dikembangkan untuk membangun sistem trading
              intelligence berbasis AI. Sistem ini menggabungkan
              market analysis, market intelligence, macro analysis,
              fundamental analysis, news intelligence, risk
              management, dan decision engine dalam satu ekosistem.
            </p>

            <p className="mt-4 max-w-3xl leading-8 text-slate-400">
              Proyek ini terus dikembangkan dan diuji secara bertahap.
              Setiap keputusan trading tetap memiliki risiko dan tidak
              ada sistem yang dapat menjamin keuntungan.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Explore APLIFIX Trader AI
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Our Vision
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Dari sebuah project menjadi ekosistem teknologi
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              APLIFIX dibangun dengan pendekatan jangka panjang.
              Kami ingin mengembangkan teknologi secara bertahap,
              memperkuat fondasi, mempelajari apa yang berhasil,
              memperbaiki apa yang belum sempurna, dan pada akhirnya
              menghasilkan produk digital yang dapat digunakan oleh
              lebih banyak orang dan bisnis.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                PT APLIFIX DIGITAL INDONESIA
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Bandung, Indonesia
              </p>
            </div>

            <Link
              href="/"
              className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Back to APLIFIX →
            </Link>
          </div>
        </section>
      </div>
      <PublicFooter />
    </main>
  );
}
