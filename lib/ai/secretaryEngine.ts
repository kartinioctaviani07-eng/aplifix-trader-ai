import { aplifixKnowledgeBase } from "@/lib/ai/knowledgeBase";
import {
  matchKnowledge,
  normalizeSecretaryMessage,
} from "@/lib/ai/intentMatcher";
import { applyResponsePolicy } from "@/lib/ai/responsePolicy";
import type { SecretaryResult } from "@/lib/ai/secretaryTypes";

const UNKNOWN_RESPONSE =
  "Saya belum menemukan informasi resmi yang cukup untuk menjawab pertanyaan tersebut. Saya tidak ingin mengarang jawaban. Saya dapat membantu menjelaskan tentang APLIFIX, APLIFIX Trader AI, AI team, Risk Manager, pengujian sistem, proposal, dan kerja sama.";

export function askAplifixSecretary(
  message: string,
): SecretaryResult {
  const normalizedMessage =
    normalizeSecretaryMessage(message);

  if (!normalizedMessage) {
    return {
      answer:
        "Silakan tuliskan pertanyaan Anda. Saya siap membantu menjelaskan APLIFIX.",
      intent: "EMPTY_MESSAGE",
      domain: "company",
      confidence: 0,
      actions: [],
    };
  }

  const matches = matchKnowledge(
    normalizedMessage,
    aplifixKnowledgeBase,
  );

  const bestMatch = matches[0];

  if (!bestMatch || bestMatch.score < 5) {
    return {
      answer: UNKNOWN_RESPONSE,
      intent: "UNKNOWN",
      domain: "company",
      confidence: 0,
      actions: [
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
      ],
    };
  }

  const secondMatch = matches[1];
  const scoreGap = secondMatch
    ? bestMatch.score - secondMatch.score
    : bestMatch.score;

  const confidence = Math.min(
    0.99,
    Math.max(
      0.55,
      0.55 + bestMatch.score / 100 + scoreGap / 50,
    ),
  );

  const policyResult = applyResponsePolicy(
    normalizedMessage,
    bestMatch.entry.answer,
    bestMatch.entry.actions ?? [],
  );

  return {
    answer: policyResult.answer,
    intent: bestMatch.entry.intents[0] ?? "UNKNOWN",
    domain: bestMatch.entry.domain,
    confidence,
    actions: policyResult.actions,
    matchedKnowledgeId: bestMatch.entry.id,
  };
}
