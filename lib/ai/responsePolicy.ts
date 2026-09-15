import type { SecretaryAction } from "@/lib/ai/secretaryTypes";

const sensitivePatterns = [
  "password",
  "pin",
  "otp",
  "api secret",
  "secret key",
  "private key",
];

const financialGuaranteePatterns = [
  "pasti untung",
  "jaminan profit",
  "garansi profit",
  "jaminan keuntungan",
  "pasti profit",
];

const defaultActions: SecretaryAction[] = [
  {
    label: "Tentang APLIFIX",
    href: "/about",
  },
  {
    label: "Baca Proposal",
    href: "/proposal",
  },
  {
    label: "Hubungi APLIFIX",
    href: "/contact",
  },
];

export function applyResponsePolicy(
  message: string,
  answer: string,
  actions: SecretaryAction[],
): {
  answer: string;
  actions: SecretaryAction[];
} {
  const normalized = message.toLowerCase();

  const containsSensitiveRequest =
    sensitivePatterns.some((pattern) =>
      normalized.includes(pattern),
    );

  if (containsSensitiveRequest) {
    return {
      answer:
        "Untuk keamanan, jangan kirim password, PIN, OTP, API secret, private key, atau kredensial sensitif melalui chat. Integrasi resmi harus menggunakan mekanisme otorisasi yang aman.",
      actions: [
        {
          label: "Hubungi APLIFIX",
          href: "/contact",
        },
      ],
    };
  }

  const asksGuarantee =
    financialGuaranteePatterns.some((pattern) =>
      normalized.includes(pattern),
    );

  if (asksGuarantee) {
    return {
      answer:
        "Tidak ada jaminan keuntungan dalam trading. APLIFIX tidak menjanjikan profit dan tidak akan membuat klaim performa yang tidak didukung data resmi.",
      actions: [
        {
          label: "Baca Proposal",
          href: "/proposal",
        },
      ],
    };
  }

  return {
    answer,
    actions:
      actions.length > 0
        ? actions
        : defaultActions,
  };
}
