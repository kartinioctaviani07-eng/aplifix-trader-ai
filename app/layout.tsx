import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import AIFloatingAssistant from "@/components/public/AIFloatingAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://aplifix-trader-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "APLIFIX DIGITAL — Kantor Trading Dijalankan AI",
    template: "%s | APLIFIX DIGITAL",
  },

  description:
    "Bagaimana jika sebuah kantor trading dijalankan AI? APLIFIX membangun digital intelligence dengan AI untuk market, analisis, risiko, keputusan, eksekusi, dan monitoring.",

  applicationName: "APLIFIX DIGITAL",

  keywords: [
    "APLIFIX",
    "APLIFIX Digital",
    "AI Trading",
    "Trading AI",
    "Digital Intelligence",
    "AI Market Analyst",
    "AI Risk Management",
    "AI Trade Executor",
  ],

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "APLIFIX DIGITAL",
    title: "Bagaimana Jika Kantor Trading Dijalankan AI?",
    description:
      "CEO AI, Market Analyst AI, Risk AI, dan Trade Executor AI bekerja sebagai satu digital intelligence.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bagaimana Jika Kantor Trading Dijalankan AI?",
    description:
      "CEO AI, Market Analyst AI, Risk AI, dan Trade Executor AI bekerja sebagai satu digital intelligence.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        {children}
        <AIFloatingAssistant />
      </body>
    </html>
  );
}
