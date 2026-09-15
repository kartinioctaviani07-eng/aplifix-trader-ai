import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const riskKnowledge: KnowledgeEntry[] = [
  {
    id: "risk-overview",
    domain: "risk",
    intents: ["RISK_OVERVIEW"],
    keywords: [
      "risiko",
      "risk",
      "aman",
      "keamanan",
      "safety",
      "risk management",
    ],
    answer:
      "Trading tetap memiliki risiko. APLIFIX menggunakan Risk Manager sebagai lapisan kontrol untuk membatasi keputusan yang tidak memenuhi parameter risiko. Namun Risk Manager bukan jaminan bahwa kerugian tidak akan terjadi.",
    actions: [
      {
        label: "Risk Management",
        href: "/risk-management",
      },
    ],
    priority: 12,
  },
  {
    id: "risk-ai-error",
    domain: "risk",
    intents: ["AI_ERROR"],
    keywords: [
      "ai salah",
      "kalau ai salah",
      "jika ai salah",
      "ai bisa salah",
      "kesalahan ai",
      "error ai",
    ],
    answer:
      "Ya. AI dapat membuat keputusan yang salah dan tidak ada sistem AI yang sempurna. Karena itu APLIFIX tidak menempatkan AI sebagai sesuatu yang selalu benar. Sistem membutuhkan risk controls, pengujian, monitoring, evaluasi, dan batasan.",
    priority: 14,
  },
  {
    id: "risk-guarantee",
    domain: "risk",
    intents: ["NO_PROFIT_GUARANTEE"],
    keywords: [
      "jaminan profit",
      "jaminan keuntungan",
      "pasti untung",
      "pasti profit",
      "garansi profit",
      "garansi keuntungan",
      "profit pasti",
    ],
    answer:
      "Tidak. APLIFIX tidak menjanjikan keuntungan. Trading dapat menghasilkan keuntungan maupun kerugian, dan hasil backtest atau performa sebelumnya tidak menjamin hasil masa depan.",
    actions: [
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
    ],
    priority: 16,
  },
  {
    id: "risk-password",
    domain: "risk",
    intents: ["CREDENTIAL_SAFETY"],
    keywords: [
      "password",
      "pin",
      "api key",
      "api secret",
      "secret key",
      "kode otp",
      "otp",
      "akun",
    ],
    answer:
      "Jangan mengirimkan password, PIN, OTP, API secret, atau kredensial sensitif kepada AI Secretary. Untuk integrasi trading di masa depan, APLIFIX harus menggunakan mekanisme otorisasi resmi dan aman, bukan meminta kredensial pribadi melalui chat.",
    priority: 18,
  },
  {
    id: "risk-loss",
    domain: "risk",
    intents: ["TRADING_LOSS"],
    keywords: [
      "kalau rugi",
      "siapa tanggung rugi",
      "kerugian",
      "rugi",
      "loss",
      "kehilangan uang",
    ],
    answer:
      "Kerugian merupakan risiko yang melekat pada trading. AI dan sistem manajemen risiko dapat membantu mengendalikan risiko, tetapi tidak dapat menghilangkan risiko pasar. Ketentuan tanggung jawab dalam suatu kerja sama harus dituangkan secara resmi dalam dokumen yang berlaku.",
    priority: 15,
  },
];
