import type {
  KnowledgeEntry,
  SecretaryDomain,
} from "@/lib/ai/secretaryTypes";

export type MatchResult = {
  entry: KnowledgeEntry;
  score: number;
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 3);
}

function calculateScore(
  message: string,
  entry: KnowledgeEntry,
): number {
  const normalizedMessage = normalizeText(message);
  const messageTokens = new Set(tokenize(normalizedMessage));

  let score = entry.priority ?? 0;

  for (const keyword of entry.keywords) {
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) {
      continue;
    }

    if (normalizedMessage.includes(normalizedKeyword)) {
      score += normalizedKeyword.includes(" ")
        ? 8
        : 4;
      continue;
    }

    const keywordTokens = tokenize(normalizedKeyword);

    const matchedTokens = keywordTokens.filter((token) =>
      messageTokens.has(token),
    );

    if (keywordTokens.length > 0) {
      score +=
        (matchedTokens.length / keywordTokens.length) * 3;
    }
  }

  score += calculateIntentPatternBonus(
    normalizedMessage,
    entry.id,
  );

  return score;
}

function calculateIntentPatternBonus(
  message: string,
  entryId: string,
): number {
  const definitionPatterns = [
    /^apa itu\s+(.+)$/,
    /^(.+)\s+itu apa$/,
    /^apa\s+(.+)$/,
    /^siapa\s+(.+)$/,
  ];

  const isDefinitionQuestion =
    definitionPatterns.some((pattern) =>
      pattern.test(message),
    );

  if (
    isDefinitionQuestion &&
    entryId === "company-overview"
  ) {
    return 35;
  }

  const isWhyQuestion =
    message.includes("kenapa") ||
    message.includes("mengapa") ||
    message.includes("alasan");

  if (
    isWhyQuestion &&
    entryId === "faq-why-aplifix"
  ) {
    return 30;
  }

  const trustPatterns = [
    "bisa dipercaya",
    "kenapa percaya",
    "alasan percaya",
    "bukti",
    "bukan penipuan",
    "bukan scam",
    "gimmick",
  ];

  const asksAboutTrust = trustPatterns.some(
    (pattern) => message.includes(pattern),
  );

  if (
    asksAboutTrust &&
    entryId === "faq-trust"
  ) {
    return 35;
  }

  const focusPatterns = [
    "bergerak di bidang apa",
    "bergerak dibidang apa",
    "bidang apa",
    "fokus di apa",
    "fokusnya apa",
    "bisnis apa",
    "industri apa",
  ];

  const asksAboutFocus = focusPatterns.some(
    (pattern) => message.includes(pattern),
  );

  if (
    asksAboutFocus &&
    entryId === "company-focus"
  ) {
    return 35;
  }

  return 0;
}

export function matchKnowledge(
  message: string,
  knowledge: KnowledgeEntry[],
): MatchResult[] {
  return knowledge
    .map((entry) => ({
      entry,
      score: calculateScore(message, entry),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        (b.entry.priority ?? 0) -
        (a.entry.priority ?? 0)
      );
    });
}

export function inferDomain(
  entry: KnowledgeEntry,
): SecretaryDomain {
  return entry.domain;
}

export function normalizeSecretaryMessage(
  message: string,
): string {
  return normalizeText(message);
}
