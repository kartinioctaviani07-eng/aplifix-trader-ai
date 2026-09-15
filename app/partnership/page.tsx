"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const interestOptions = [
  "Teknologi / AI",
  "Pengembangan Produk",
  "Kemitraan Bisnis",
  "APLIFIX Trader AI",
  "Lainnya",
];

export default function PartnershipPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(interestOptions[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/partnership-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          interest,
          message,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        setStatus(
          data.message ?? "Data belum dapat disimpan. Silakan coba lagi.",
        );
        return;
      }

      setStatus(
        data.message ??
          "Minat kerja sama berhasil dikirim ke APLIFIX.",
      );
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus(
        "Koneksi bermasalah. Silakan coba lagi beberapa saat kemudian.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/proposal"
          className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          ← Kembali ke Proposal
        </Link>

        <div className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            APLIFIX Partnership
          </p>
          <h1 className="mt-4 text-4xl font-bold">
            Ajukan Minat Kerja Sama
          </h1>
          <p className="mt-5 leading-7 text-slate-400">
            Isi data sederhana di bawah ini. Ini merupakan formulir minat
            kerja sama, bukan persetujuan investasi atau pengiriman dana.
          </p>
        </div>

        <form
          onSubmit={submitForm}
          className="mt-10 space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Nama
            </span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Nama lengkap"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="nama@email.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Nomor WhatsApp
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Opsional"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Minat kerja sama
            </span>
            <select
              value={interest}
              onChange={(event) => setInterest(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            >
              {interestOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-300">
              Pesan
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Ceritakan sedikit mengenai kebutuhan atau minat Anda."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Minat Kerja Sama"}
          </button>

          {status ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-400">
              {status}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
