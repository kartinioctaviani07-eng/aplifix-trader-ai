import type { KnowledgeEntry } from "@/lib/ai/secretaryTypes";

import { aiTeamKnowledge } from "@/lib/knowledge/aiTeam";
import { companyKnowledge } from "@/lib/knowledge/company";
import { faqKnowledge } from "@/lib/knowledge/faq";
import { investorKnowledge } from "@/lib/knowledge/investor";
import { partnershipKnowledge } from "@/lib/knowledge/partnership";
import { riskKnowledge } from "@/lib/knowledge/risk";
import { traderAIKnowledge } from "@/lib/knowledge/traderAI";
import { validationKnowledge } from "@/lib/knowledge/validation";

export const aplifixKnowledgeBase: KnowledgeEntry[] = [
  ...companyKnowledge,
  ...traderAIKnowledge,
  ...aiTeamKnowledge,
  ...riskKnowledge,
  ...validationKnowledge,
  ...partnershipKnowledge,
  ...investorKnowledge,
  ...faqKnowledge,
];
