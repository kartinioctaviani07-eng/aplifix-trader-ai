import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const partnershipKnowledge: KnowledgeEntry[] = [
  {
    id: "partnership-overview",
    domain: "partnership",
    intents: ["PARTNERSHIP"],
    keywords: [
      "kerja sama",
      "kerjasama",
      "partnership",
      "partner",
      "mitra",
      "bekerja sama",
      "mau kerja sama",
    ],
    answer:
      "APLIFIX membuka ruang untuk minat kerja sama di bidang teknologi, AI, software, pengembangan produk, trading intelligence, dan pengembangan ekosistem digital. Anda dapat membaca proposal terlebih dahulu atau langsung mengirimkan minat kerja sama.",
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
    priority: 15,
  },
  {
    id: "partnership-developer",
    domain: "partnership",
    intents: ["PARTNERSHIP_TECH"],
    keywords: [
      "developer",
      "programmer",
      "programmer",
      "software engineer",
      "teknologi",
      "developer bisa gabung",
      "mau bantu coding",
    ],
    answer:
      "APLIFIX dapat membuka peluang kolaborasi teknologi sesuai kebutuhan pengembangan. Jika Anda memiliki keahlian atau solusi yang ingin ditawarkan, Anda dapat mengirimkan minat kerja sama secara online agar dapat ditinjau.",
    actions: [
      {
        label: "Ajukan Minat",
        href: "/partnership",
      },
    ],
    priority: 13,
  },
  {
    id: "partnership-proposal",
    domain: "partnership",
    intents: ["PROPOSAL"],
    keywords: [
      "proposal",
      "baca proposal",
      "lihat proposal",
      "dokumen kerja sama",
      "penawaran",
    ],
    answer:
      "Proposal APLIFIX menjelaskan profil perusahaan, APLIFIX Trader AI, arsitektur konsep, manajemen risiko, visi digital office, AI Architect, dan konsep kerja sama.",
    actions: [
      {
        label: "Buka Proposal",
        href: "/proposal",
      },
    ],
    priority: 15,
  },
  {
    id: "partnership-online",
    domain: "partnership",
    intents: ["ONLINE_PARTNERSHIP"],
    keywords: [
      "online",
      "ketemu",
      "meeting",
      "tatap muka",
      "datang",
      "kantor",
      "harus datang",
    ],
    answer:
      "APLIFIX dirancang dengan pendekatan digital-first. Tahap awal informasi, proposal, dan penyampaian minat kerja sama dapat dilakukan secara online. Jika suatu proses di kemudian hari membutuhkan verifikasi atau dokumen tertentu, mekanismenya akan mengikuti kebutuhan resmi proses tersebut.",
    priority: 11,
  },
];
