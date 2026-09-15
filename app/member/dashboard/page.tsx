import Link from "next/link";
import { redirect } from "next/navigation";

import db from "@/lib/db/database";
import { getMemberSession } from "@/lib/member/session";

type MemberRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type DemoAccountRow = {
  id: string;
  initial_balance: number;
  balance: number;
  created_at: number;
  updated_at: number;
};

function formatRupiah(
  amount: number,
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(
  timestamp: number,
): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default async function MemberDashboardPage() {
  const session =
    await getMemberSession();

  if (!session) {
    redirect("/member/login");
  }

  const member = db
    .prepare(
      `
        SELECT
          id,
          name,
          email,
          role,
          status
        FROM member_accounts
        WHERE id = ?
        LIMIT 1
      `,
    )
    .get(session.memberId) as
    | MemberRow
    | undefined;

  if (!member) {
    redirect("/member/login");
  }

  if (member.status !== "ACTIVE") {
    redirect("/member/login");
  }

  const demoAccount = db
    .prepare(
      `
        SELECT
          id,
          initial_balance,
          balance,
          created_at,
          updated_at
        FROM demo_accounts
        WHERE member_id = ?
        LIMIT 1
      `,
    )
    .get(member.id) as
    | DemoAccountRow
    | undefined;

  if (!demoAccount) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            APLIFIX MEMBER
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Demo Account belum tersedia
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Akun Member Anda sudah aktif,
            tetapi Demo Account belum ditemukan.
            Silakan hubungi Office APLIFIX.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              APLIFIX MEMBER
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Member Dashboard
            </h1>

            <p className="mt-3 text-slate-400">
              Selamat datang,{" "}
              <span className="font-semibold text-white">
                {member.name}
              </span>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-emerald-400">
              Status Member
            </p>

            <p className="mt-1 font-semibold text-emerald-300">
              ACTIVE
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-500">
              Demo Balance
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {formatRupiah(
                demoAccount.balance,
              )}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Saldo simulasi Member
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-500">
              Modal Awal
            </p>

            <p className="mt-3 text-3xl font-bold text-white">
              {formatRupiah(
                demoAccount.initial_balance,
              )}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Demo Account dibuat saat approval
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-sm text-slate-500">
              Account ID
            </p>

            <p className="mt-3 break-all text-sm font-semibold text-slate-300">
              {demoAccount.id}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Dibuat {formatDate(
                demoAccount.created_at,
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              APLIFIX TRADER AI
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Intelligence untuk perjalanan
              trading demo Anda.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Gunakan Trader AI untuk melihat
              kondisi pasar, intelligence,
              analisis, dan sinyal dalam lingkungan
              demo. Tidak terhubung ke saldo nyata
              Member.
            </p>

            <Link
              href="/member/trader"
              className="mt-7 inline-flex rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Buka Trader AI →
            </Link>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              ACCOUNT
            </p>

            <h2 className="mt-4 text-xl font-bold">
              {member.name}
            </h2>

            <p className="mt-2 break-all text-sm text-slate-500">
              {member.email}
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Role
                </span>

                <span className="font-medium text-slate-300">
                  {member.role}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Status
                </span>

                <span className="font-medium text-emerald-300">
                  {member.status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Updated
                </span>

                <span className="text-right text-xs text-slate-500">
                  {formatDate(
                    demoAccount.updated_at,
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <p className="text-sm font-semibold text-amber-300">
            Demo Environment
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Saldo Rp10.000.000 pada halaman ini
            adalah saldo simulasi untuk lingkungan
            demo. Ini bukan saldo investasi, bukan
            dana perusahaan, dan bukan jaminan
            keuntungan.
          </p>
        </div>
      </div>
    </main>
  );
}
