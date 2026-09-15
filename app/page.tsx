"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PublicFooter from "@/components/public/PublicFooter";

type MarketTicker = {
  symbol: string;
  name: string;
  market: "stock" | "forex" | "commodity" | "crypto";
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  timestamp: number;
};

type MarketResponse = {
  success: boolean;
  provider: string;
  data?: MarketTicker;
  message?: string;
};

const MARKET_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
] as const;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 4 : 2,
  }).format(price);
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSymbol(symbol: string): string {
  return symbol.replace("USDT", "/USDT");
}

function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

const AI_ROLES = [
  {
    icon: "◈",
    name: "AI CEO",
    label: "Strategic Decision",
    description:
      "Mengambil keputusan strategis berdasarkan kondisi market, intelligence, dan hasil analisis berbagai AI.",
  },
  {
    icon: "⌁",
    name: "AI Market Analyst",
    label: "Market Intelligence",
    description:
      "Membaca kondisi pasar dan mencari peluang berdasarkan data market yang tersedia.",
  },
  {
    icon: "⌘",
    name: "AI Technical Analyst",
    label: "Technical Analysis",
    description:
      "Menganalisis pergerakan harga, trend, momentum, dan indikator teknikal.",
  },
  {
    icon: "◉",
    name: "AI News & Sentiment",
    label: "News Intelligence",
    description:
      "Membaca berita dan sentimen untuk membantu memahami kondisi informasi di sekitar market.",
  },
  {
    icon: "◇",
    name: "AI Fundamental",
    label: "Fundamental Intelligence",
    description:
      "Menganalisis faktor fundamental yang relevan terhadap aset dan keputusan trading.",
  },
  {
    icon: "◎",
    name: "AI Macro",
    label: "Macro Intelligence",
    description:
      "Mempertimbangkan kondisi ekonomi dan faktor makro yang dapat memengaruhi market.",
  },
  {
    icon: "◆",
    name: "AI Risk Manager",
    label: "Risk Control",
    description:
      "Mengawasi risiko dan menjadi lapisan kontrol sebelum keputusan trading dijalankan.",
  },
  {
    icon: "→",
    name: "AI Trade Executor",
    label: "Execution",
    description:
      "Menjalankan keputusan trading sesuai aturan dan batasan sistem yang telah ditentukan.",
  },
  {
    icon: "◌",
    name: "AI Monitor",
    label: "Continuous Monitoring",
    description:
      "Memantau posisi yang berjalan dan mengevaluasi kondisi untuk keputusan berikutnya.",
  },
] as const;

export default function Home() {
  const [markets, setMarkets] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    document.title = "APLIFIX DIGITAL INDONESIA";

    let cancelled = false;

    const loadMarkets = async () => {
      try {
        const results = await Promise.all(
          MARKET_SYMBOLS.map(
            async (symbol): Promise<MarketTicker | null> => {
              const response = await fetch(
                `/api/market?symbol=${encodeURIComponent(symbol)}`,
                {
                  cache: "no-store",
                },
              );

              if (!response.ok) {
                return null;
              }

              const result: MarketResponse = await response.json();

              if (!result.success || !result.data) {
                return null;
              }

              return result.data;
            },
          ),
        );

        if (!cancelled) {
          const validMarkets = results.filter(
            (market): market is MarketTicker => market !== null,
          );

          setMarkets(validMarkets);
          setLastUpdated(Date.now());
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadMarkets();

    const interval = window.setInterval(() => {
      void loadMarkets();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const primaryMarket = useMemo(
    () => markets.find((market) => market.symbol === "BTCUSDT") ?? null,
    [markets],
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HERO / DIGITAL OFFICE */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_36%)]" />

        <div className="absolute right-[-120px] top-24 hidden h-80 w-80 rounded-full border border-emerald-500/10 lg:block" />
        <div className="absolute right-[-60px] top-36 hidden h-60 w-60 rounded-full border border-emerald-500/10 lg:block" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-5xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              APLIFIX DIGITAL INTELLIGENCE
            </div>

            <h1 className="max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Bagaimana jika sebuah
              <span className="block text-emerald-400">
                kantor trading dijalankan AI?
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400 sm:text-xl">
              APLIFIX membangun ekosistem digital intelligence dengan
              berbagai AI yang bekerja berdasarkan perannya untuk membaca
              market, menganalisis informasi, mengelola risiko, mengambil
              keputusan, menjalankan eksekusi, dan memantau posisi.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/member/register"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
              >
                🚀 Daftar Member
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Masuk ke lingkungan Demo Trading Intelligence dan lihat
              bagaimana ekosistem AI bekerja.
            </p>

            <div className="mt-14 grid max-w-4xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Digital Office
                </p>
                <p className="mt-2 font-semibold text-white">
                  AI bekerja berdasarkan peran
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Intelligence
                </p>
                <p className="mt-2 font-semibold text-white">
                  Market & risk dianalisis
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Demo Account
                </p>
                <p className="mt-2 font-semibold text-emerald-400">
                  Saldo simulasi Rp10.000.000
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI DIGITAL OFFICE */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              The APLIFIX Digital Office
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Bukan satu AI.
              <span className="block text-slate-400">
                Sebuah ekosistem AI.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Setiap AI memiliki fungsi berbeda. Mereka dirancang untuk
              bekerja dalam sebuah alur intelligence yang terstruktur,
              bukan sekadar menghasilkan sinyal secara acak.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AI_ROLES.map((role) => (
              <div
                key={role.name}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xl font-bold text-emerald-400">
                    {role.icon}
                  </div>

                  <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {role.label}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {role.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FLOW */}
      <section className="border-b border-slate-800 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                How It Works
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                Dari market data
                <span className="block text-emerald-400">
                  sampai keputusan AI.
                </span>
              </h2>

              <p className="mt-6 leading-7 text-slate-400">
                Ekosistem APLIFIX dirancang agar proses intelligence dapat
                berjalan melalui beberapa lapisan sebelum keputusan trading
                dijalankan.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
              <div className="space-y-3">
                {[
                  ["01", "Market Data", "Data market masuk ke intelligence layer."],
                  ["02", "AI Analysis", "Berbagai AI membaca kondisi dari perspektif masing-masing."],
                  ["03", "AI CEO", "Keputusan strategis dievaluasi berdasarkan intelligence yang tersedia."],
                  ["04", "AI Risk Manager", "Risiko diperiksa sebelum keputusan dapat dijalankan."],
                  ["05", "AI Trade Executor", "Keputusan yang lolos dijalankan sesuai aturan sistem."],
                  ["06", "AI Monitor", "Posisi yang berjalan terus dipantau."],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
                      {number}
                    </div>

                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBER CTA */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_38%)]" />

            <div className="relative grid gap-12 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  APLIFIX Member
                </p>

                <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Biarkan AI yang bekerja.
                </h2>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                  Bergabung sebagai Member dan masuk ke lingkungan Demo
                  Trading Intelligence APLIFIX. Lihat bagaimana AI membaca
                  market, mengambil keputusan, membuka posisi, memantau
                  risiko, dan mengevaluasi posisi yang berjalan.
                </p>

                <div className="mt-8">
                  <Link
                    href="/member/register"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    🚀 Daftar Member
                  </Link>
                </div>

                <p className="mt-5 max-w-2xl text-xs leading-5 text-slate-500">
                  Keanggotaan ini bukan investasi, bukan pembelian saham, dan
                  tidak menjanjikan keuntungan. Saldo demo merupakan saldo
                  simulasi.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-slate-900/70 p-7">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                  Demo Account
                </p>

                <p className="mt-3 text-4xl font-bold text-emerald-400 sm:text-5xl">
                  Rp10.000.000
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Saldo simulasi untuk lingkungan demo Member. Bukan uang
                  tunai dan bukan dana investasi.
                </p>

                <div className="mt-7 space-y-3 border-t border-slate-800 pt-6">
                  {[
                    "Member dashboard",
                    "AI demo trading environment",
                    "Portfolio & trade history",
                    "AI decision activity",
                    "Demo P&L monitoring",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <span className="text-emerald-400">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE MARKET */}
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Live Market
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Market intelligence, in real time.
              </h2>

              <p className="mt-4 max-w-2xl text-slate-400">
                Salah satu fondasi ekosistem APLIFIX adalah kemampuan
                mengakses dan membaca data market secara langsung.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Live data
              {lastUpdated !== null && (
                <span>· Updated {formatTime(lastUpdated)}</span>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_SYMBOLS.map((symbol) => {
              const market = markets.find(
                (item) => item.symbol === symbol,
              );

              const positive = market
                ? market.changePercent >= 0
                : true;

              return (
                <div
                  key={symbol}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">
                      {formatSymbol(symbol)}
                    </span>

                    <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                      Crypto
                    </span>
                  </div>

                  {loading && !market ? (
                    <div className="mt-6 space-y-3">
                      <div className="h-8 w-32 animate-pulse rounded bg-slate-800" />
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
                    </div>
                  ) : market ? (
                    <>
                      <p className="mt-6 text-2xl font-bold text-white">
                        ${formatPrice(market.price)}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span
                          className={
                            positive
                              ? "font-semibold text-emerald-400"
                              : "font-semibold text-red-400"
                          }
                        >
                          {positive ? "+" : ""}
                          {market.changePercent.toFixed(2)}%
                        </span>

                        <span className="text-slate-500">24h</span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-xs">
                        <div>
                          <p className="text-slate-500">High</p>
                          <p className="mt-1 font-medium text-slate-300">
                            ${formatPrice(market.high)}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-500">Low</p>
                          <p className="mt-1 font-medium text-slate-300">
                            ${formatPrice(market.low)}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-slate-500">
                        Market data unavailable
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARKET DETAIL */}
      {primaryMarket && (
        <section className="border-b border-slate-800 bg-slate-900/20">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Market Snapshot
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  {formatSymbol(primaryMarket.symbol)}
                </h2>

                <p className="mt-2 text-slate-500">
                  Live market data powered through APLIFIX MarketHub.
                </p>

                <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
                  <span className="text-5xl font-bold tracking-tight">
                    ${formatPrice(primaryMarket.price)}
                  </span>

                  <span
                    className={
                      primaryMarket.changePercent >= 0
                        ? "mb-1 text-lg font-semibold text-emerald-400"
                        : "mb-1 text-lg font-semibold text-red-400"
                    }
                  >
                    {primaryMarket.changePercent >= 0 ? "+" : ""}
                    {primaryMarket.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    24h High
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    ${formatPrice(primaryMarket.high)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    24h Low
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    ${formatPrice(primaryMarket.low)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    24h Change
                  </p>

                  <p
                    className={
                      primaryMarket.change >= 0
                        ? "mt-2 text-xl font-semibold text-emerald-400"
                        : "mt-2 text-xl font-semibold text-red-400"
                    }
                  >
                    {primaryMarket.change >= 0 ? "+" : ""}
                    ${formatPrice(primaryMarket.change)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    24h Volume
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    {formatCompactNumber(primaryMarket.volume)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WHY MEMBER */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Why Become a Member?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Jangan hanya melihat AI.
              <span className="block text-emerald-400">
                Masuk dan lihat bagaimana AI bekerja.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Member mendapatkan akses ke lingkungan demo yang dirancang
              untuk memperlihatkan proses trading intelligence secara lebih
              nyata: analisis, keputusan, eksekusi simulasi, monitoring,
              dan riwayat hasil demo.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7">
              <div className="text-3xl">🧠</div>

              <h3 className="mt-5 text-xl font-semibold">
                Lihat Intelligence
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Amati bagaimana berbagai AI membaca market dan menghasilkan
                informasi untuk proses keputusan.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7">
              <div className="text-3xl">⚙️</div>

              <h3 className="mt-5 text-xl font-semibold">
                Lihat AI Bekerja
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Demo environment memperlihatkan siklus analisis, keputusan,
                eksekusi simulasi, dan monitoring posisi.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-7">
              <div className="text-3xl">📊</div>

              <h3 className="mt-5 text-xl font-semibold">
                Demo Account
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Member mendapatkan lingkungan simulasi dengan saldo demo
                Rp10.000.000 untuk mengenal cara kerja sistem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          The APLIFIX Vision
        </p>

        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
          Membangun kantor digital
          <span className="block text-emerald-400">
            yang semakin intelligent.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          APLIFIX DIGITAL INDONESIA sedang membangun fondasi teknologi yang
          menggabungkan software engineering, artificial intelligence,
          automation, dan digital intelligence ke dalam sebuah ekosistem
          yang terus berkembang.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950 px-8 py-14 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_55%)]" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                APLIFIX MEMBER
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                Penasaran bagaimana kantor
                <span className="block text-emerald-400">
                  yang dijalankan AI bekerja?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-slate-400">
                Bergabung sebagai Member dan dapatkan akses ke Demo Account
                dengan saldo simulasi Rp10.000.000.
              </p>

              <Link
                href="/member/register"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-9 py-4 font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
              >
                🚀 Daftar Member
              </Link>

              <p className="mx-auto mt-5 max-w-2xl text-xs leading-5 text-slate-500">
                Demo account adalah lingkungan simulasi. Keanggotaan bukan
                investasi dan tidak menjanjikan keuntungan finansial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
