import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

export const metadata = {
  title: "Terms of Use | APLIFIX DIGITAL INDONESIA",
  description:
    "Terms of Use PT APLIFIX DIGITAL INDONESIA.",
};

export default function TermsPage() {
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
            Terms of Use
          </h1>

          <p className="mt-5 text-slate-400">
            Ketentuan umum penggunaan website, software, dan layanan
            digital APLIFIX.
          </p>
        </header>

        <article className="space-y-10 py-12 leading-8 text-slate-400">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Acceptance
            </h2>

            <p className="mt-4">
              Dengan mengakses atau menggunakan layanan APLIFIX, Anda
              dianggap telah memahami dan menyetujui ketentuan penggunaan
              yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Use of Services
            </h2>

            <p className="mt-4">
              Layanan APLIFIX harus digunakan secara wajar, sah, dan tidak
              untuk aktivitas yang dapat merusak sistem, mengganggu
              pengguna lain, atau melanggar hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Intellectual Property
            </h2>

            <p className="mt-4">
              Nama, identitas visual, software, desain, kode, dan materi
              yang dikembangkan oleh APLIFIX dapat merupakan kekayaan
              intelektual APLIFIX atau pihak yang memiliki hak terkait.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Service Availability
            </h2>

            <p className="mt-4">
              Kami berusaha menjaga layanan tetap tersedia dan berfungsi
              dengan baik. Namun, layanan dapat mengalami pemeliharaan,
              perubahan, gangguan provider, atau kondisi teknis lainnya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Changes
            </h2>

            <p className="mt-4">
              APLIFIX dapat memperbarui layanan dan ketentuan ini dari
              waktu ke waktu sesuai dengan perkembangan teknologi dan
              kebutuhan perusahaan.
            </p>
          </section>
        </article>
      </div>

      <PublicFooter />
    </main>
  );
}
