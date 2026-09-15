import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "Privacy Policy | APLIFIX DIGITAL INDONESIA",
  description:
    "Privacy Policy PT APLIFIX DIGITAL INDONESIA.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-5 text-slate-400">
            Kebijakan ini menjelaskan secara umum bagaimana APLIFIX
            menangani informasi ketika Anda menggunakan website dan
            layanan digital kami.
          </p>
        </header>

        <article className="space-y-10 py-12 leading-8 text-slate-400">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Information We Collect
            </h2>

            <p className="mt-4">
              Informasi dapat diberikan secara langsung ketika Anda
              menghubungi APLIFIX, menggunakan layanan, atau berinteraksi
              dengan sistem kami. Informasi tersebut dapat mencakup
              nama, alamat email, informasi project, dan data lain yang
              Anda pilih untuk berikan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. How We Use Information
            </h2>

            <p className="mt-4">
              Informasi digunakan untuk menyediakan, mengembangkan,
              mengamankan, memelihara, dan meningkatkan layanan serta
              untuk berkomunikasi mengenai kebutuhan atau project yang
              Anda sampaikan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Data Security
            </h2>

            <p className="mt-4">
              Kami berupaya menggunakan langkah teknis dan operasional
              yang wajar untuk melindungi informasi. Namun, tidak ada
              sistem digital yang dapat menjamin keamanan secara mutlak.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Third-Party Services
            </h2>

            <p className="mt-4">
              Beberapa layanan dapat menggunakan provider atau teknologi
              pihak ketiga untuk menyediakan fungsi tertentu. Penggunaan
              layanan tersebut dapat tunduk pada kebijakan privasi
              masing-masing provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Contact
            </h2>

            <p className="mt-4">
              Untuk pertanyaan mengenai kebijakan privasi, Anda dapat
              menghubungi:
            </p>

            <a
              href="mailto:aplifixdigitalindonesia@gmail.com"
              className="mt-3 inline-block font-medium text-emerald-400"
            >
              aplifixdigitalindonesia@gmail.com
            </a>
          </section>
        </article>
      </div>

      <PublicFooter />
    </main>
  );
}
