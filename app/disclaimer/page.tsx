import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "Disclaimer | APLIFIX DIGITAL INDONESIA",
  description:
    "Disclaimer PT APLIFIX DIGITAL INDONESIA.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          ← Back to APLIFIX
        </Link>

        <header className="mt-14 border-b border-slate-800 pb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            PT APLIFIX DIGITAL INDONESIA
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Disclaimer
          </h1>

          <p className="mt-5 text-slate-400">
            Informasi penting mengenai penggunaan informasi dan trading
            intelligence yang tersedia melalui produk APLIFIX.
          </p>
        </header>

        <article className="space-y-10 py-12 leading-8 text-slate-400">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. General Information
            </h2>

            <p className="mt-4">
              Informasi yang tersedia pada website dan produk APLIFIX
              disediakan untuk tujuan informasi, teknologi, penelitian,
              dan pengembangan sistem.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Trading Intelligence
            </h2>

            <p className="mt-4">
              APLIFIX Trader AI merupakan sistem teknologi dan trading
              intelligence. Analisis, skor, sinyal, keputusan AI, data
              pasar, atau informasi lain yang ditampilkan bukan merupakan
              jaminan hasil investasi dan bukan jaminan keuntungan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. No Guarantee of Profit
            </h2>

            <p className="mt-4">
              Aktivitas trading memiliki risiko. Kondisi pasar dapat
              berubah dengan cepat dan hasil masa lalu tidak menjamin
              hasil di masa depan. Tidak ada sistem AI yang dapat
              menjamin keuntungan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. User Responsibility
            </h2>

            <p className="mt-4">
              Setiap keputusan penggunaan modal dan aktivitas trading
              merupakan tanggung jawab pengguna. Pengguna sebaiknya
              memahami risiko dan melakukan evaluasi independen sebelum
              mengambil keputusan finansial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Market Data
            </h2>

            <p className="mt-4">
              Data pasar dapat berasal dari provider pihak ketiga dan
              dapat mengalami keterlambatan, perubahan, gangguan, atau
              ketidakakuratan. APLIFIX tidak menjamin bahwa setiap data
              pasar selalu lengkap atau bebas dari kesalahan.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="text-xl font-bold text-white">
              Important Notice
            </h2>

            <p className="mt-3">
              Jangan menggunakan informasi dari APLIFIX sebagai satu-satunya
              dasar untuk mengambil keputusan finansial atau investasi.
            </p>
          </section>
        </article>
      </div>

      <PublicFooter />
    </main>
  );
}
