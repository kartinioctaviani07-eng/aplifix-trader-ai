import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const aiTeamKnowledge: KnowledgeEntry[] = [
  {
    id: "ai-team-overview",
    domain: "ai_team",
    intents: ["AI_TEAM_OVERVIEW"],
    keywords: [
      "ai apa saja",
      "ada ai apa",
      "jenis ai",
      "tim ai",
      "ai nya apa",
      "artificial intelligence apa",
      "modul ai",
    ],
    answer:
      "Konsep AI team APLIFIX terdiri dari beberapa peran dengan tanggung jawab berbeda: CEO AI, Market Analyst atau Technical AI, Market Intelligence, News dan Sentiment AI, Macro AI, Fundamental AI, Risk Manager AI, Trade Executor, serta AI Memory. Struktur ini dibuat agar setiap fungsi memiliki tanggung jawab yang jelas.",
    priority: 14,
  },
  {
    id: "ai-ceo",
    domain: "ai_team",
    intents: ["AI_CEO"],
    keywords: [
      "ceo ai",
      "ai ceo",
      "tugas ceo",
      "fungsi ceo",
      "decision maker",
      "pengambil keputusan",
    ],
    answer:
      "CEO AI berfungsi sebagai decision layer tingkat tinggi. Ia menggabungkan informasi dari berbagai modul analisis untuk menentukan apakah kondisi lebih sesuai untuk BUY, SELL, HOLD, atau WAIT, dengan tetap tunduk pada Risk Manager.",
    priority: 12,
  },
  {
    id: "ai-market-analyst",
    domain: "ai_team",
    intents: ["AI_MARKET_ANALYST"],
    keywords: [
      "market analyst",
      "technical ai",
      "technical analyst",
      "analyst",
      "analisa teknikal",
      "technical analysis",
    ],
    answer:
      "Market Analyst atau Technical AI bertugas membaca kondisi teknikal pasar, termasuk struktur pasar dan indikator yang digunakan sistem. Hasilnya menjadi salah satu input untuk decision engine.",
    priority: 11,
  },
  {
    id: "ai-market-intelligence",
    domain: "ai_team",
    intents: ["AI_MARKET_INTELLIGENCE"],
    keywords: [
      "market intelligence",
      "intelijen pasar",
      "kondisi pasar",
      "informasi pasar",
    ],
    answer:
      "Market Intelligence bertugas memberikan konteks yang lebih luas mengenai kondisi pasar sehingga decision engine tidak hanya bergantung pada satu indikator teknikal.",
    priority: 10,
  },
  {
    id: "ai-news-sentiment",
    domain: "ai_team",
    intents: ["AI_NEWS_SENTIMENT"],
    keywords: [
      "news ai",
      "sentiment ai",
      "berita",
      "sentimen",
      "news",
      "sentiment",
    ],
    answer:
      "News dan Sentiment AI dirancang untuk menganalisis informasi berita dan sentimen yang relevan terhadap kondisi pasar. Modul ini menjadi salah satu sumber informasi, bukan satu-satunya dasar keputusan.",
    priority: 10,
  },
  {
    id: "ai-macro",
    domain: "ai_team",
    intents: ["AI_MACRO"],
    keywords: [
      "macro ai",
      "ekonomi makro",
      "makro",
      "macro",
      "suku bunga",
      "inflasi",
      "ekonomi",
    ],
    answer:
      "Macro AI berfokus pada konteks ekonomi makro yang dapat memengaruhi kondisi pasar, seperti lingkungan suku bunga, inflasi, dan faktor ekonomi lainnya yang relevan dengan strategi sistem.",
    priority: 10,
  },
  {
    id: "ai-fundamental",
    domain: "ai_team",
    intents: ["AI_FUNDAMENTAL"],
    keywords: [
      "fundamental ai",
      "fundamental",
      "analisa fundamental",
      "fundamental analysis",
    ],
    answer:
      "Fundamental AI bertugas menganalisis faktor fundamental yang relevan dengan aset atau pasar yang sedang dievaluasi. Modul ini melengkapi technical dan market analysis.",
    priority: 10,
  },
  {
    id: "ai-risk",
    domain: "ai_team",
    intents: ["AI_RISK_MANAGER"],
    keywords: [
      "risk manager",
      "risk ai",
      "tugas risk manager",
      "fungsi risk manager",
      "siapa yang mengontrol risiko",
    ],
    answer:
      "Risk Manager AI bertugas menilai apakah keputusan perdagangan memenuhi batas risiko sistem. Risk Manager memiliki kewenangan untuk memveto keputusan apabila parameter risiko tidak terpenuhi.",
    actions: [
      {
        label: "Risk Management",
        href: "/risk-management",
      },
    ],
    priority: 13,
  },
  {
    id: "ai-executor",
    domain: "ai_team",
    intents: ["AI_TRADE_EXECUTOR"],
    keywords: [
      "trade executor",
      "executor",
      "eksekusi",
      "menjalankan trade",
      "siapa yang trading",
    ],
    answer:
      "Trade Executor merupakan lapisan yang bertanggung jawab menjalankan keputusan perdagangan setelah keputusan tersebut melewati aturan dan risk controls yang ditetapkan sistem.",
    priority: 10,
  },
  {
    id: "ai-architect",
    domain: "ai_team",
    intents: ["AI_ARCHITECT"],
    keywords: [
      "ai architect",
      "system architect",
      "arsitek ai",
      "arsitek sistem",
      "chatgpt",
      "siapa yang membangun ai",
      "siapa yang bikin",
    ],
    answer:
      "Dalam pengembangan APLIFIX Trader AI, ChatGPT berperan sebagai AI Architect / System Architect yang membantu merancang arsitektur sistem, decision engine, risk management, AI memory, trading lifecycle, dashboard, dan ekosistem digital APLIFIX. Pengembangan dan keputusan produk tetap berada di bawah PT APLIFIX DIGITAL INDONESIA.",
    actions: [
      {
        label: "Tentang APLIFIX",
        href: "/about",
      },
    ],
    priority: 15,
  },
];
