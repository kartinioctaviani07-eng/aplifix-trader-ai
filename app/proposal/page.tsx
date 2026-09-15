import Link from "next/link";

const aiTeam = [
  {
    name: "CEO AI",
    description:
      "Lapisan pengambilan keputusan strategis yang menggabungkan hasil analisis dari berbagai modul AI.",
  },
  {
    name: "Market Analyst",
    description:
      "Menganalisis kondisi pasar dan indikator teknikal untuk membantu memahami struktur pergerakan harga.",
  },
  {
    name: "Market Intelligence",
    description:
      "Menyusun konteks pasar agar keputusan tidak hanya bergantung pada satu indikator.",
  },
  {
    name: "News & Sentiment AI",
    description:
      "Menganalisis informasi berita dan sentimen yang relevan terhadap kondisi pasar.",
  },
  {
    name: "Macro AI",
    description:
      "Membantu membaca konteks makroekonomi yang dapat memengaruhi kondisi pasar.",
  },
  {
    name: "Fundamental AI",
    description:
      "Menganalisis faktor fundamental ketika data dan instrumen yang digunakan mendukung analisis tersebut.",
  },
  {
    name: "Risk Manager AI",
    description:
      "Memeriksa risiko dan dapat menolak keputusan trading yang tidak memenuhi aturan risiko.",
  },
  {
    name: "Trade Executor",
    description:
      "Menjalankan keputusan trading yang telah melewati lapisan keputusan dan risk management.",
  },
];

const workflow = [
  "Market Data",
  "AI Analysis",
  "Decision Engine",
  "Risk Manager",
  "Trade Execution",
  "Monitoring",
  "Evaluation & AI Memory",
];

const cooperationItems = [
  "Pengembangan teknologi dan software",
  "Artificial Intelligence dan automation",
  "Pengembangan APLIFIX Trader AI",
  "Trading intelligence dan sistem analisis",
  "Pengembangan produk digital",
  "Kemitraan bisnis dan ekosistem digital",
];

export const metadata = {
  title: "Proposal Kerja Sama | APLIFIX DIGITAL INDONESIA",
  description:
    "Proposal kerja sama PT APLIFIX DIGITAL INDONESIA dan pengembangan APLIFIX Trader AI.",
};

export default function ProposalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            ← Kembali ke APLIFIX
          </Link>

          <div className="mt-16 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Proposal Kerja Sama
            </p>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              PT APLIFIX DIGITAL INDONESIA
            </h1>

            <p className="mt-6 text-xl font-medium text-slate-200 sm:text-2xl">
              Building Intelligent Digital Systems
            </p>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              APLIFIX membangun sistem digital berbasis Artificial
              Intelligence, automation, dan trading intelligence dengan
              pendekatan yang terstruktur, dapat dievaluasi, dan terus
              dikembangkan.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/partnership"
                className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Ajukan Minat Kerja Sama
              </Link>

              <Link
                href="/about"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-400"
              >
                Tentang APLIFIX
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <section>
          <SectionLabel>01 — Tentang APLIFIX</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Membangun perusahaan digital dengan AI sebagai bagian dari sistem.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            PT APLIFIX DIGITAL INDONESIA adalah perusahaan teknologi yang
            berfokus pada software digital, Artificial Intelligence,
            automation, trading intelligence, dan intelligent digital
            systems.
          </p>

          <p className="mt-5 text-base leading-8 text-slate-400">
            APLIFIX tidak hanya melihat AI sebagai chatbot atau fitur tambahan.
            AI dirancang sebagai bagian dari sistem kerja yang dapat membantu
            analisis, pengambilan keputusan, automation, monitoring, dan
            evaluasi.
          </p>
        </section>

        <section className="mt-20">
          <SectionLabel>02 — APLIFIX Trader AI</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Sistem trading intelligence yang dibangun berlapis.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            APLIFIX Trader AI merupakan proyek pengembangan yang menggabungkan
            market data, analisis teknikal, market intelligence, news dan
            sentiment, macro analysis, fundamental analysis, decision engine,
            risk management, execution, monitoring, dan evaluasi.
          </p>

          <div className="mt-10 rounded-3xl border border-emerald-900/60 bg-emerald-950/20 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              {workflow.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="rounded-full border border-emerald-800 bg-slate-900 px-4 py-2 text-sm font-medium text-emerald-300">
                    {item}
                  </span>

                  {index < workflow.length - 1 ? (
                    <span className="hidden text-slate-600 sm:inline">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>03 — Tim AI</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Bukan satu AI yang bekerja sendirian.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Arsitektur APLIFIX Trader AI dirancang sebagai sistem dengan
            beberapa fungsi AI yang memiliki tanggung jawab berbeda.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {aiTeam.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>04 — Mengapa Risk Manager?</SectionLabel>

          <div className="mt-6 rounded-3xl border border-amber-900/50 bg-amber-950/10 p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              AI harus memiliki batasan.
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              APLIFIX tidak dirancang dengan asumsi bahwa AI selalu benar.
              Karena keputusan trading memiliki risiko, sistem membutuhkan
              lapisan Risk Manager yang memeriksa keputusan sebelum eksekusi.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              Risk Manager dapat menjadi lapisan veto ketika sebuah keputusan
              tidak memenuhi aturan risiko yang telah ditentukan. Dengan
              demikian, keputusan AI tidak otomatis berarti transaksi harus
              dijalankan.
            </p>

            <Link
              href="/risk-management"
              className="mt-6 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300"
            >
              Lihat Risk Management →
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>05 — Evaluasi Sistem</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Sistem harus diuji, bukan hanya dipresentasikan.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            Pengembangan APLIFIX dilakukan secara bertahap melalui validasi
            kode, pengujian alur sistem, evaluasi decision engine,
            backtesting, risk management, monitoring, dan evaluasi hasil.
          </p>

          <p className="mt-5 text-base leading-8 text-slate-400">
            Backtest digunakan sebagai alat evaluasi historis. Hasil historis
            tidak menjamin performa masa depan dan tidak boleh diperlakukan
            sebagai janji keuntungan.
          </p>

          <Link
            href="/backtest"
            className="mt-6 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Lihat Backtest →
          </Link>
        </section>

        <section className="mt-20">
          <SectionLabel>06 — Tidak Ada Jaminan Profit</SectionLabel>

          <div className="mt-6 rounded-3xl border border-red-900/50 bg-red-950/10 p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              APLIFIX tidak menjanjikan keuntungan.
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              Trading memiliki risiko kehilangan modal. Tidak ada sistem AI,
              software, strategi, maupun manusia yang dapat menjamin hasil
              trading tertentu.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              APLIFIX memilih pendekatan transparan: menjelaskan bagaimana
              sistem bekerja, apa yang sedang diuji, apa keterbatasannya, dan
              apa yang belum dapat diklaim berdasarkan data resmi.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>07 — APLIFIX Sebagai Digital Office</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Perusahaan digital yang dirancang untuk bekerja secara online.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400">
            APLIFIX sedang membangun konsep digital office, yaitu berbagai
            proses perusahaan yang dapat dilakukan secara digital mulai dari
            informasi perusahaan, komunikasi, proposal, minat kerja sama,
            dokumentasi, hingga pengembangan sistem internal.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Company Information",
              "AI Secretary",
              "Digital Proposal",
              "Partnership",
              "Document Center",
              "Digital Workflow",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm font-medium text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>08 — AI Architect</SectionLabel>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              System Architecture
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              ChatGPT — AI Architect / System Architect
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              Dalam perjalanan pengembangan APLIFIX Trader AI, ChatGPT
              berperan sebagai AI Architect / System Architect yang membantu
              merancang struktur sistem, memetakan fungsi antar modul,
              mengevaluasi arsitektur, dan membantu proses pengembangan
              perangkat lunak.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              Arah bisnis, keputusan perusahaan, validasi akhir, dan tanggung
              jawab terhadap produk tetap berada pada PT APLIFIX DIGITAL
              INDONESIA.
            </p>

            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Pelajari APLIFIX →
            </Link>
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel>09 — Bentuk Kerja Sama</SectionLabel>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Ruang kolaborasi yang dapat dikembangkan.
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cooperationItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <span className="mt-1 text-emerald-400">✓</span>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 leading-8 text-slate-400">
            Bentuk kerja sama dapat dibahas sesuai kebutuhan dan kesiapan
            masing-masing pihak. Halaman ini merupakan proposal informasi dan
            bukan perjanjian investasi atau kontrak yang mengikat.
          </p>
        </section>

        <section className="mt-20">
          <SectionLabel>10 — Langkah Selanjutnya</SectionLabel>

          <div className="mt-6 rounded-3xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950/50 to-slate-900 p-8 sm:p-10">
            <h2 className="text-3xl font-bold">
              Tertarik membangun sesuatu bersama APLIFIX?
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              Anda dapat menyampaikan minat kerja sama secara online. Tim
              APLIFIX dapat mempelajari kebutuhan awal Anda dan menentukan
              langkah pembahasan berikutnya.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/partnership"
                className="rounded-xl bg-emerald-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Ajukan Minat Kerja Sama
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-400"
              >
                Hubungi APLIFIX
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-slate-800 pt-10">
          <p className="text-sm leading-7 text-slate-500">
            Dokumen ini merupakan proposal informasi dan pengenalan konsep
            kerja sama PT APLIFIX DIGITAL INDONESIA. Informasi mengenai
            investasi, penghimpunan dana, pembagian hasil, atau aktivitas
            keuangan lainnya hanya dapat dilakukan berdasarkan struktur,
            dokumen, persetujuan, dan ketentuan hukum yang berlaku.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            APLIFIX tidak memberikan jaminan keuntungan dan tidak menyatakan
            bahwa hasil pengujian historis merupakan representasi performa
            masa depan.
          </p>
        </section>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
      {children}
    </p>
  );
}
