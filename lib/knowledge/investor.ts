import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const investorKnowledge: KnowledgeEntry[] = [
  {
    id: "investor-status",
    domain: "investor",
    intents: ["INVESTOR_STATUS"],
    keywords: [
      "investor",
      "investasi",
      "tanam modal",
      "modal",
      "invest sekarang",
      "mau investasi",
    ],
    answer:
      "Saat ini website APLIFIX belum mengaktifkan penerimaan dana publik melalui AI Secretary. Konsep ekosistem investor masih dikembangkan secara bertahap dan setiap bentuk kerja sama finansial harus mengikuti struktur hukum, dokumen, dan ketentuan yang berlaku.",
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
    priority: 17,
  },
  {
    id: "investor-return",
    domain: "investor",
    intents: ["INVESTOR_RETURN"],
    keywords: [
      "return",
      "imbal hasil",
      "bagi hasil",
      "profit sharing",
      "pembagian profit",
      "berapa keuntungan",
      "berapa return",
    ],
    answer:
      "Saya tidak dapat menjanjikan atau menetapkan angka return. Struktur keuntungan, biaya, atau pembagian hasil baru dapat disebut sebagai ketentuan resmi apabila telah ditetapkan dalam dokumen bisnis dan hukum APLIFIX.",
    priority: 18,
  },
  {
    id: "investor-capital",
    domain: "investor",
    intents: ["INVESTOR_CAPITAL"],
    keywords: [
      "kasih uang",
      "setor uang",
      "kirim uang",
      "transfer modal",
      "deposit",
      "dana",
      "uang saya",
    ],
    answer:
      "Jangan mengirim dana hanya berdasarkan percakapan dengan AI Secretary. Saat ini APLIFIX belum mengaktifkan penerimaan dana publik melalui sistem ini. Informasi finansial resmi harus berasal dari dokumen dan kanal resmi perusahaan.",
    priority: 19,
  },
];
