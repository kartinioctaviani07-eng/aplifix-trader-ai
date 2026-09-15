"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success?: boolean;
  message?: string;
  member?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
};

export default function MemberLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/member/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data =
        (await response.json()) as LoginResponse;

      if (!response.ok || !data.success) {
        setError(
          data.message ??
            "Login Member gagal.",
        );
        return;
      }

      router.push(
        "/member/dashboard",
      );
      router.refresh();
    } catch {
      setError(
        "Koneksi bermasalah. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              APLIFIX MEMBER
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Member Login
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Masuk ke Member Dashboard dan
              akses APLIFIX Trader AI.
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
              {error}
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/50"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Memproses..."
                : "Masuk sebagai Member"}
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Belum menjadi Member?
            </p>

            <Link
              href="/member/register"
              className="mt-2 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Daftar Member
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-600 hover:text-slate-400"
            >
              ← Kembali ke APLIFIX
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
