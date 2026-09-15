import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const traderAIKnowledge: KnowledgeEntry[] = [
  {
    id: "trader-overview",
    domain: "trader_ai",
    intents: ["TRADER_AI_OVERVIEW"],
    keywords: [
      "trader ai",
      "trading ai",
      "aplifix trader",
      "bot trading",
      "robot trading",
      "sistem trading",
    ],
    answer:
      "APLIFIX Trader AI adalah sistem trading intelligence yang dirancang untuk menggabungkan market data, technical analysis, market intelligence, news dan sentiment, macro analysis, fundamental analysis, decision engine, Risk Manager, trade execution, position monitoring, dan AI memory.",
    actions: [
      {
        label: "Buka Trader AI",
        href: "/trader",
      },
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
    ],
    priority: 12,
  },
  {
    id: "trader-how-it-works",
    domain: "trader_ai",
    intents: ["TRADER_AI_WORKFLOW"],
    keywords: [
      "cara kerja",
      "bagaimana bekerja",
      "alur trading",
      "workflow",
      "proses trading",
      "proses ai",
      "cara sistem",
    ],
    answer:
      "Secara konsep, alurnya adalah market data masuk ke berbagai modul analisis, hasil analisis dikonsolidasikan oleh decision engine, kemudian keputusan dinilai oleh Risk Manager. Jika memenuhi aturan sistem, keputusan dapat diteruskan ke execution layer. Posisi dan hasil perdagangan kemudian dipantau dan dicatat untuk evaluasi.",
    priority: 10,
  },
  {
    id: "trader-analysis",
    domain: "trader_ai",
    intents: ["TRADER_ANALYSIS"],
    keywords: [
      "analisis",
      "technical",
      "teknikal",
      "indikator",
      "market analysis",
      "analisa pasar",
      "menganalisis pasar",
    ],
    answer:
      "APLIFIX Trader AI menggunakan technical dan market analysis sebagai bagian dari decision pipeline. Sistem dapat mempertimbangkan struktur pasar dan indikator teknikal bersama informasi dari modul lain, bukan hanya satu indikator sebagai dasar keputusan.",
    priority: 9,
  },
  {
    id: "trader-decision",
    domain: "trader_ai",
    intents: ["TRADER_DECISION"],
    keywords: [
      "siapa yang memutuskan",
      "siapa mengambil keputusan",
      "keputusan buy",
      "keputusan sell",
      "buy sell",
      "siapa yang menentukan",
      "ceo ai",
    ],
    answer:
      "Dalam arsitektur APLIFIX Trader AI, CEO AI berperan sebagai decision layer tingkat tinggi. Namun keputusan tersebut tidak berdiri sendiri karena harus melewati aturan dan Risk Manager sebelum dapat diteruskan ke execution layer.",
    priority: 11,
  },
  {
    id: "trader-hold-wait",
    domain: "trader_ai",
    intents: ["TRADER_HOLD_WAIT"],
    keywords: [
      "hold",
      "wait",
      "tidak trading",
      "tidak entry",
      "menunggu",
      "diam",
    ],
    answer:
      "HOLD atau WAIT merupakan bagian penting dari sistem. Tidak melakukan perdagangan juga merupakan keputusan. Jika kondisi pasar atau tingkat keyakinan belum memenuhi kriteria sistem, lebih baik menunggu daripada memaksakan entry.",
    priority: 10,
  },
  {
    id: "trader-learning",
    domain: "trader_ai",
    intents: ["TRADER_MEMORY"],
    keywords: [
      "belajar",
      "learning",
      "ai memory",
      "memory",
      "pengalaman",
      "hasil sebelumnya",
      "evaluasi hasil",
    ],
    answer:
      "APLIFIX memiliki konsep AI Memory untuk mencatat keputusan dan hasil perdagangan. Data tersebut dapat digunakan sebagai bahan evaluasi agar sistem dapat dianalisis berdasarkan riwayat keputusan, bukan sekadar melihat satu transaksi.",
    priority: 8,
  },
  {
    id: "trader-difference",
    domain: "trader_ai",
    intents: ["TRADER_DIFFERENCE"],
    keywords: [
      "beda dengan bot",
      "bedanya bot",
      "beda trading bot",
      "bot biasa",
      "robot biasa",
      "kenapa berbeda",
    ],
    answer:
      "Konsep APLIFIX Trader AI tidak hanya berfokus pada satu sinyal BUY atau SELL. Sistem dirancang sebagai pipeline yang menggabungkan beberapa lapisan analisis, decision engine, Risk Manager, execution, monitoring, dan evaluasi. Karena itu, pendekatannya lebih luas daripada sekadar indikator yang menghasilkan sinyal.",
    priority: 10,
  },
];
