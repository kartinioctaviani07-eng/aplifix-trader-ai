export type SecretaryDomain =
  | "company"
  | "trader_ai"
  | "ai_team"
  | "risk"
  | "validation"
  | "partnership"
  | "investor"
  | "faq";

export type SecretaryAction = {
  label: string;
  href: string;
};

export type KnowledgeEntry = {
  id: string;
  domain: SecretaryDomain;
  intents: string[];
  keywords: string[];
  answer: string;
  actions?: SecretaryAction[];
  priority?: number;
};

export type SecretaryResult = {
  answer: string;
  intent: string;
  domain: SecretaryDomain;
  confidence: number;
  actions: SecretaryAction[];
  matchedKnowledgeId?: string;
};

export type SecretaryRequest = {
  message: string;
};
