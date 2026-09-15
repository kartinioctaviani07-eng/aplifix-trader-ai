"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterResponse = {
  success: boolean;
  message: string;
  data?: {
    memberId: string;
    status: string;
  };
};

export default function MemberRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/member/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result =
        (await response.json()) as RegisterResponse;

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Pendaftaran Member gagal.",
        );
        return;
      }

      router.push("/member/payment");
    } catch {
      setError(
        "Tidak dapat terhubung ke server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <section className="hidden border-r border-slate-800 bg-slate-950 p-10 lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  APLIFIX
                </p>

                <h1 className="mt-6 text-4xl font-bold leading-tight">
                  Masuk ke ekosistem
                  <span className="block text-emerald-400">
                    APLIFIX Trader AI
                  </span>
                </h1>

                <p className="mt-6 max-w-md leading-7 text-slate-400">
                  Aktivasi Member memberikan akses
                  ke lingkungan demo trading intelligence
                  dan pengalaman APLIFIX Trader AI.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm text-slate-500">
                    Aktivasi Member
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    Rp10.000
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm text-slate-500">
                    Demo Account
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    Rp10.000.000
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <Link
                href="/"
                className="text-sm text-slate-500 transition hover:text-white"
              >
                ← Kembali ke APLIFIX
              </Link>

              <div className="mt-10">
                <p className="text-sm font-semibold text-emerald-400">
                  MEMBER REGISTRATION
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Daftar Member
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Buat akun Member untuk melanjutkan
                  proses aktivasi APLIFIX.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Nama lengkap
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                    minLength={2}
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Konfirmasi password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                    placeholder="Ulangi password"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Mendaftarkan..."
                    : "Daftar Member"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                Aktivasi Member bukan investasi,
                bukan pembelian saham, dan tidak
                menjanjikan keuntungan. Saldo demo
                merupakan saldo simulasi.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
