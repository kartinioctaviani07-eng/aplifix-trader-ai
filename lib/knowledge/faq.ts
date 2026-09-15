import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

export const faqKnowledge: KnowledgeEntry[] = [
  {
    id: "faq-beginner",
    domain: "faq",
    intents: ["BEGINNER"],
    keywords: [
      "tidak ngerti trading",
      "gak ngerti trading",
      "nggak ngerti trading",
      "awam",
      "pemula",
      "baru belajar",
      "tidak paham trading",
    ],
    answer:
      "Tidak masalah jika Anda masih awam. APLIFIX AI Assistant dapat menjelaskan konsepnya dari dasar. Namun untuk menggunakan sistem trading dengan dana nyata, pemahaman mengenai risiko tetap penting. AI tidak menggantikan pemahaman pengguna.",
    priority: 14,
  },
  {
    id: "faq-why-aplifix",
    domain: "faq",
    intents: ["WHY_APLIFIX"],
    keywords: [
      "kenapa aplifix",
      "mengapa aplifix",
      "harus pakai aplifix",
      "alasan pakai aplifix",
      "kenapa saya harus",
      "apa kelebihan aplifix",
      "mengapa memilih aplifix",
    ],
    answer:
      "Anda tidak harus menggunakan APLIFIX. Yang kami bangun adalah sebuah sistem intelligence yang menggabungkan analisis, decision engine, risk management, execution, monitoring, dan evaluasi. Jika pendekatan tersebut sesuai dengan kebutuhan Anda, APLIFIX dapat menjadi salah satu pilihan yang dipertimbangkan. Kami lebih memilih menjelaskan kemampuan dan keterbatasan sistem daripada menjanjikan hasil.",
    priority: 20,
  },
  {
    id: "faq-trust",
    domain: "faq",
    intents: ["WHY_TRUST"],
    keywords: [
      "kenapa percaya",
      "bisa dipercaya",
      "percaya aplifix",
      "bukti",
      "bukan penipuan",
      "bukan scam",
      "gimmick",
      "abal abal",
      "abalabal",
    ],
    answer:
      "Kepercayaan seharusnya dibangun melalui transparansi, dokumentasi, pengujian, dan proses yang dapat diperiksa, bukan hanya melalui klaim AI. Karena itu APLIFIX membangun sistem secara bertahap dan mendokumentasikan arsitektur, pengujian, risk management, serta keterbatasannya. Saya juga tidak akan mengklaim sesuatu sebagai fakta jika belum memiliki data resmi.",
    priority: 20,
  },
  {
    id: "faq-ai-not-perfect",
    domain: "faq",
    intents: ["AI_NOT_PERFECT"],
    keywords: [
      "ai sempurna",
      "ai selalu benar",
      "ai tidak pernah salah",
      "apakah ai benar terus",
      "ai akurat terus",
    ],
    answer:
      "Tidak. AI tidak selalu benar. Sistem yang serius justru harus dirancang dengan asumsi bahwa AI dapat salah. Karena itu APLIFIX menggunakan beberapa lapisan analisis, Risk Manager, testing, monitoring, dan evaluasi.",
    priority: 18,
  },
  {
    id: "faq-human-role",
    domain: "faq",
    intents: ["HUMAN_ROLE"],
    keywords: [
      "manusia",
      "human",
      "peran manusia",
      "manusia masih perlu",
      "ai menggantikan manusia",
      "ai mengganti manusia",
    ],
    answer:
      "AI dirancang untuk membantu pekerjaan dan pengambilan keputusan, bukan berarti semua tanggung jawab manusia otomatis hilang. APLIFIX tetap membutuhkan manusia untuk menentukan tujuan bisnis, kebijakan, pengawasan, validasi, dan keputusan strategis perusahaan.",
    priority: 13,
  },
  {
    id: "faq-contact",
    domain: "faq",
    intents: ["CONTACT"],
    keywords: [
      "kontak",
      "contact",
      "email",
      "hubungi",
      "hubungi kalian",
      "cara menghubungi",
    ],
    answer:
      "Untuk komunikasi resmi, Anda dapat menghubungi PT APLIFIX DIGITAL INDONESIA melalui aplifixdigitalindonesia@gmail.com.",
    actions: [
      {
        label: "Hubungi APLIFIX",
        href: "/contact",
      },
    ],
    priority: 12,
  },
];
