"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function OfficeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(
        "/api/office/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        setStatus(
          data.message ??
            "Login belum berhasil.",
        );
        return;
      }

      router.push("/office");
      router.refresh();
    } catch {
      setStatus(
        "Koneksi bermasalah. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            APLIFIX DIGITAL OFFICE
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Office Login
          </h1>

          <p className="mt-3 text-slate-400">
            Area internal APLIFIX untuk
            pengelolaan operasional digital.
          </p>
        </div>

        <form
          onSubmit={submitLogin}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Office
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="Email admin"
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
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="Password"
            />
          </div>

          {status ? (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {status}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Memproses..."
              : "Masuk ke Office"}
          </button>
        </form>
      </div>
    </main>
  );
}
