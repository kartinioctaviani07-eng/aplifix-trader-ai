import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "Products | APLIFIX DIGITAL INDONESIA",
  description:
    "Produk dan teknologi yang dikembangkan oleh PT APLIFIX DIGITAL INDONESIA.",
};

const products = [
  {
    number: "01",
    category: "Trading Intelligence",
    title: "APLIFIX Trader AI",
    description:
      "Platform trading intelligence yang menggabungkan market data, AI analysis, risk management, decision engine, dan autonomous trading workflow dalam satu sistem.",
    features: [
      "AI Market Analysis",
      "CEO Decision Engine",
      "Risk Management",
      "Market Intelligence",
      "Trading Execution",
      "Performance Memory",
    ],
    href: "/",
    action: "Open Trader AI",
    featured: true,
  },
  {
    number: "02",
    category: "Artificial Intelligence",
    title: "AI & Automation",
    description:
      "Sistem AI yang dirancang untuk membantu proses analisis, otomatisasi workflow, pengambilan keputusan, dan pengolahan informasi.",
    features: [
      "AI Decision Systems",
      "Workflow Automation",
      "Intelligent Analysis",
      "Data Processing",
    ],
    href: "/contact",
    action: "Discuss a Project",
    featured: false,
  },
  {
    number: "03",
    category: "Digital Systems",
    title: "Custom Digital Systems",
    description:
      "Pengembangan software dan sistem digital yang disesuaikan dengan kebutuhan bisnis, organisasi, dan operasional nyata.",
    features: [
      "Web Applications",
      "Business Systems",
      "Dashboard",
      "Data Management",
    ],
    href: "/contact",
    action: "Build a System",
    featured: false,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <header className="border-b border-slate-800 pb-20">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            ← Back to APLIFIX
          </Link>

          <div className="mt-14 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              APLIFIX DIGITAL INDONESIA
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Technology built for
              <span className="block text-emerald-400">
                intelligent operations.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400">
              Kami membangun software, artificial intelligence, dan
              digital systems yang dirancang untuk menyelesaikan
              kebutuhan nyata secara bertahap dan terukur.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-2xl font-bold text-white">AI</p>
              <p className="mt-2 text-sm text-slate-500">
                Intelligence & Decision Systems
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-2xl font-bold text-white">Digital</p>
              <p className="mt-2 text-sm text-slate-500">
                Software & Business Systems
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-2xl font-bold text-white">Intelligence</p>
              <p className="mt-2 text-sm text-slate-500">
                Data-driven technology
              </p>
            </div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Products & Technology
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              What we are building
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              Produk APLIFIX dikembangkan dari kebutuhan nyata. Setiap
              sistem memiliki tujuan, workflow, dan fondasi teknologi
              yang dapat dikembangkan lebih lanjut.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {products.map((product) => (
              <article
                key={product.number}
                className={`rounded-3xl border p-7 sm:p-9 ${
                  product.featured
                    ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950"
                    : "border-slate-800 bg-slate-900/60"
                }`}
              >
                <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-emerald-400">
                        {product.number}
                      </span>

                      <span className="h-px w-10 bg-emerald-500/30" />

                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                      {product.title}
                    </h3>

                    <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                      {product.description}
                    </p>

                    <Link
                      href={product.href}
                      className="mt-7 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      {product.action}
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      System capabilities
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {product.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-xs font-bold text-emerald-400">
                            ✓
                          </span>

                          <span className="text-sm font-medium text-slate-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-800 py-20">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Have an idea?
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                Let&apos;s build the next system.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Jika ada kebutuhan software, AI, automation, atau
                digital system yang ingin dikembangkan, APLIFIX siap
                memulai dari pembahasan dan kebutuhan dasarnya.
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex shrink-0 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 lg:mt-0"
            >
              Contact APLIFIX
            </Link>
          </div>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}
