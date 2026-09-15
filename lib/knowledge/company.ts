import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const companyKnowledge: KnowledgeEntry[] = [
  {
    id: "company-overview",
    domain: "company",
    intents: ["COMPANY_OVERVIEW"],
    keywords: [
      "aplifix",
      "perusahaan",
      "company",
      "bisnis",
      "bergerak",
      "buat apa",
      "ngapain",
      "tentang",
      "siapa",
    ],
    answer:
      "PT APLIFIX DIGITAL INDONESIA adalah perusahaan teknologi dari Bandung yang berfokus pada software digital, Artificial Intelligence, automation, trading intelligence, dan intelligent digital systems. Salah satu proyek utama yang sedang dikembangkan adalah APLIFIX Trader AI.",
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
    priority: 10,
  },
  {
    id: "company-vision",
    domain: "company",
    intents: ["COMPANY_VISION"],
    keywords: [
      "visi",
      "vision",
      "masa depan",
      "kedepan",
      "tujuan besar",
      "cita cita",
    ],
    answer:
      "Visi APLIFIX adalah membangun intelligent digital systems yang dapat membantu manusia bekerja, menganalisis informasi, mengambil keputusan secara lebih terstruktur, dan menjalankan proses digital secara lebih efisien.",
    priority: 8,
  },
  {
    id: "company-focus",
    domain: "company",
    intents: ["COMPANY_FOCUS"],
    keywords: [
      "fokus",
      "bidang",
      "industri",
      "sektor",
      "teknologi",
      "produk",
    ],
    answer:
      "Fokus APLIFIX mencakup Artificial Intelligence, digital software, automation, trading intelligence, dan intelligent systems. APLIFIX Trader AI merupakan salah satu proyek yang menjadi bagian dari pengembangan tersebut.",
    actions: [
      {
        label: "Lihat Produk",
        href: "/products",
      },
    ],
    priority: 8,
  },
  {
    id: "company-location",
    domain: "company",
    intents: ["COMPANY_LOCATION"],
    keywords: [
      "dimana",
      "di mana",
      "lokasi",
      "kantor",
      "bandung",
      "alamat",
    ],
    answer:
      "PT APLIFIX DIGITAL INDONESIA berbasis di Bandung, Indonesia. Untuk komunikasi resmi, Anda dapat menggunakan email aplifixdigitalindonesia@gmail.com.",
    actions: [
      {
        label: "Hubungi APLIFIX",
        href: "/contact",
      },
    ],
    priority: 7,
  },
  {
    id: "company-digital-office",
    domain: "company",
    intents: ["DIGITAL_OFFICE"],
    keywords: [
      "digital office",
      "kantor digital",
      "kantor online",
      "online",
      "tanpa kantor",
      "digital company",
    ],
    answer:
      "APLIFIX sedang dibangun dengan konsep digital office. Artinya berbagai proses perusahaan dirancang agar dapat dilakukan secara online, mulai dari informasi perusahaan, komunikasi, proposal, minat kerja sama, sampai nantinya proses dokumen dan sistem internal.",
    priority: 9,
  },
  {
    id: "company-why-ai",
    domain: "company",
    intents: ["WHY_AI"],
    keywords: [
      "kenapa ai",
      "mengapa ai",
      "pakai ai",
      "gunakan ai",
      "alasan ai",
      "manfaat ai",
    ],
    answer:
      "AI digunakan APLIFIX bukan sekadar sebagai fitur tambahan. Konsepnya adalah menggunakan AI untuk membantu analisis, pengambilan keputusan, automation, monitoring, dan pekerjaan digital yang dapat dibuat lebih terstruktur. AI tetap memiliki keterbatasan dan hasilnya harus dievaluasi.",
    priority: 8,
  },
];
