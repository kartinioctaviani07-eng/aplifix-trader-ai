import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "Contact | APLIFIX DIGITAL INDONESIA",
  description:
    "Hubungi PT APLIFIX DIGITAL INDONESIA untuk software, AI, digital systems, dan trading intelligence.",
};

const services = [
  "Software Development",
  "AI & Automation",
  "Digital Systems",
  "Trading Intelligence",
  "Custom Technology",
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
        <header className="border-b border-slate-800 pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            ← Back to APLIFIX
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                PT APLIFIX DIGITAL INDONESIA
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Let&apos;s build something
                <span className="block text-emerald-400">
                  intelligent.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Punya ide software, sistem digital, AI, atau teknologi
                lain yang ingin dikembangkan? Hubungi APLIFIX dan
                mari diskusikan kebutuhan serta solusi yang mungkin
                dibangun.
              </p>

              <a
                href="mailto:aplifixdigitalindonesia@gmail.com"
                className="mt-8 inline-flex items-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Email APLIFIX
              </a>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <span className="text-xl font-bold text-emerald-400">
                  A
                </span>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company Contact
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                PT APLIFIX DIGITAL INDONESIA
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <a
                    href="mailto:aplifixdigitalindonesia@gmail.com"
                    className="mt-1 block text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    aplifixdigitalindonesia@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Bandung, Indonesia
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Focus
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    AI & Digital Systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-slate-800 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              What can we build together?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Technology for real needs
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Setiap project dimulai dari memahami kebutuhan terlebih
              dahulu, kemudian membangun solusi secara bertahap dengan
              fondasi teknologi yang jelas.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    A
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Start a conversation
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Punya project yang ingin dibangun?
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              Ceritakan kebutuhan, masalah, atau ide yang ingin
              diwujudkan. Kami dapat memulai dari pembahasan sederhana
              sebelum menentukan arah pengembangan project.
            </p>

            <a
              href="mailto:aplifixdigitalindonesia@gmail.com?subject=Project%20Inquiry%20-%20APLIFIX%20DIGITAL%20INDONESIA"
              className="mt-7 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Discuss a Project
            </a>
          </div>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}
