import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const validationKnowledge: KnowledgeEntry[] = [
  {
    id: "validation-status",
    domain: "validation",
    intents: ["SYSTEM_VALIDATION"],
    keywords: [
      "sudah teruji",
      "sudah diuji",
      "teruji",
      "diuji",
      "testing",
      "tes sistem",
      "pengujian",
      "beneran dites",
      "bukan gimmick",
    ],
    answer:
      "APLIFIX Trader AI dikembangkan dan diuji secara bertahap. Pengujian mencakup validasi kode, type checking, pengujian alur sistem, backtesting, evaluasi decision engine, serta pengujian Risk Manager. Status pengembangan dan hasil pengujian dapat berubah seiring pengembangan sistem, sehingga saya tidak akan mengklaim bahwa sistem sudah sempurna atau bebas risiko.",
    priority: 18,
  },
  {
    id: "validation-backtest",
    domain: "validation",
    intents: ["BACKTEST"],
    keywords: [
      "backtest",
      "back testing",
      "data historis",
      "historical",
      "uji historis",
    ],
    answer:
      "Backtesting digunakan untuk mengevaluasi bagaimana aturan dan decision engine akan bekerja terhadap data historis. Backtest berguna untuk menemukan kelemahan sistem, tetapi tidak menjamin performa yang sama ketika menghadapi kondisi pasar nyata.",
    actions: [
      {
        label: "Buka Backtest",
        href: "/backtest",
      },
    ],
    priority: 14,
  },
  {
    id: "validation-paper-trading",
    domain: "validation",
    intents: ["PAPER_TRADING"],
    keywords: [
      "paper trading",
      "simulasi trading",
      "demo trading",
      "uang virtual",
      "simulasi",
    ],
    answer:
      "Paper trading atau simulasi digunakan untuk menguji alur perdagangan tanpa mempertaruhkan dana nyata. Ini merupakan tahap penting sebelum sistem digunakan pada kondisi nyata.",
    priority: 13,
  },
  {
    id: "validation-production",
    domain: "validation",
    intents: ["PRODUCTION_STATUS"],
    keywords: [
      "sudah live",
      "live trading",
      "real trading",
      "uang nyata",
      "sudah menghasilkan",
      "dipakai real",
    ],
    answer:
      "APLIFIX Trader AI masih dikembangkan dan dievaluasi secara bertahap. Saya tidak akan menyatakan bahwa sistem memiliki performa live tertentu tanpa data dan dokumentasi resmi yang telah ditetapkan APLIFIX.",
    priority: 16,
  },
  {
    id: "validation-performance",
    domain: "validation",
    intents: ["PERFORMANCE"],
    keywords: [
      "performa",
      "performance",
      "akurasi",
      "win rate",
      "persentase menang",
      "berapa persen",
    ],
    answer:
      "Performa sistem harus dinilai berdasarkan data pengujian yang jelas, periode, kondisi pasar, metodologi, biaya, risiko, dan parameter evaluasi. Saya tidak akan membuat angka performa atau win rate tanpa data resmi yang tersedia.",
    priority: 16,
  },
];
