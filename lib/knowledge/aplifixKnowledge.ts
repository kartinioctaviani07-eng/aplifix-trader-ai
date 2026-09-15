export type KnowledgeEntry = {
  keywords: string[];
  answer: string;
  actions?: Array<{
    label: string;
    href: string;
  }>;
};

export const aplifixKnowledge: KnowledgeEntry[] = [
  {
    keywords: [
      "aplfix",
      "aplifix",
      "perusahaan",
      "company",
      "tentang",
      "siapa",
    ],
    answer:
      "PT APLIFIX DIGITAL INDONESIA adalah perusahaan teknologi dari Bandung yang berfokus pada software digital, Artificial Intelligence, automation, trading intelligence, dan intelligent digital systems. Salah satu proyek yang sedang dikembangkan adalah APLIFIX Trader AI.",
    actions: [
      {
        label: "Tentang APLIFIX",
        href: "/about",
      },
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
    ],
  },
  {
    keywords: [
      "trader ai",
      "trading ai",
      "aplifix trader",
      "trading",
      "trade",
    ],
    answer:
      "APLIFIX Trader AI adalah platform trading intelligence yang menggabungkan market data, technical analysis, multi-timeframe analysis, market intelligence, fundamental analysis, macro analysis, sentiment, CEO AI decision engine, Risk Manager, trade execution, position monitoring, dan AI memory. Sistem ini masih terus dikembangkan dan diuji secara bertahap.",
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
  },
  {
    keywords: [
      "risk",
      "risiko",
      "risk manager",
      "keamanan",
      "aman",
    ],
    answer:
      "APLIFIX menggunakan Risk Manager sebagai lapisan pengaman sebelum perdagangan dijalankan. Risk Manager dapat menolak keputusan CEO AI apabila parameter perdagangan tidak memenuhi batas risiko sistem. Trading tetap memiliki risiko dan APLIFIX tidak menjamin keuntungan.",
    actions: [
      {
        label: "Risk Management",
        href: "/risk-management",
      },
    ],
  },
  {
    keywords: [
      "ai architect",
      "arsitek",
      "chatgpt",
      "siapa yang membuat",
      "dibangun oleh",
    ],
    answer:
      "Dalam pengembangan APLIFIX Trader AI, ChatGPT berperan sebagai AI Architect / System Architect yang membantu merancang arsitektur sistem, decision engine, risk management, AI memory, trading lifecycle, dashboard, dan ekosistem digital APLIFIX. Pengembangan tetap berada di bawah keputusan dan kepemilikan PT APLIFIX DIGITAL INDONESIA.",
    actions: [
      {
        label: "Tentang APLIFIX",
        href: "/about",
      },
    ],
  },
  {
    keywords: [
      "kerja sama",
      "kerjasama",
      "partnership",
      "mitra",
      "partner",
      "gabung",
    ],
    answer:
      "Tentu. APLIFIX membuka ruang untuk minat kerja sama di bidang teknologi, pengembangan produk, AI, digital systems, dan pengembangan ekosistem. Anda dapat membaca proposal terlebih dahulu atau mengirimkan minat kerja sama secara online.",
    actions: [
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
      {
        label: "Ajukan Minat",
        href: "/partnership",
      },
    ],
  },
  {
    keywords: [
      "investor",
      "investasi",
      "modal",
      "tanam modal",
      "uang",
      "dana",
    ],
    answer:
      "Untuk saat ini APLIFIX belum mengaktifkan penerimaan dana publik melalui website ini. Sistem investor sedang dirancang secara bertahap. Jika Anda tertarik, Anda dapat membaca proposal dan mengirimkan minat kerja sama terlebih dahulu. APLIFIX tidak menjanjikan keuntungan dan setiap bentuk kerja sama finansial harus mengikuti struktur hukum dan dokumen resmi yang berlaku.",
    actions: [
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
      {
        label: "Ajukan Minat",
        href: "/partnership",
      },
    ],
  },
  {
    keywords: [
      "profit",
      "keuntungan",
      "untung",
      "hasil",
      "return",
      "persentase",
    ],
    answer:
      "APLIFIX tidak menjanjikan keuntungan dari trading. Perdagangan dapat menghasilkan keuntungan maupun kerugian. Angka imbal hasil atau pembagian keuntungan tidak akan saya sebutkan sebagai ketentuan resmi sebelum struktur bisnis dan dokumen resminya ditetapkan.",
    actions: [
      {
        label: "Baca Proposal",
        href: "/proposal",
      },
    ],
  },
  {
    keywords: [
      "proposal",
      "dokumen",
      "pdf",
      "penawaran",
    ],
    answer:
      "Proposal APLIFIX menjelaskan profil perusahaan, APLIFIX Trader AI, cara kerja sistem, pendekatan manajemen risiko, visi perusahaan, dan konsep kerja sama. Anda dapat membacanya langsung secara online.",
    actions: [
      {
        label: "Buka Proposal",
        href: "/proposal",
      },
    ],
  },
  {
    keywords: [
      "kontak",
      "email",
      "hubungi",
      "contact",
    ],
    answer:
      "Anda dapat menghubungi PT APLIFIX DIGITAL INDONESIA melalui aplifixdigitalindonesia@gmail.com. Lokasi perusahaan: Bandung, Indonesia.",
    actions: [
      {
        label: "Hubungi APLIFIX",
        href: "/contact",
      },
    ],
  },
];

export const defaultKnowledgeAnswer =
  "Saya adalah APLIFIX AI Assistant. Saya dapat membantu menjelaskan tentang PT APLIFIX DIGITAL INDONESIA, APLIFIX Trader AI, teknologi yang kami bangun, Risk Manager, proposal, dan peluang kerja sama. Untuk informasi yang belum tercantum dalam knowledge base resmi, saya tidak akan mengarang jawaban.";
