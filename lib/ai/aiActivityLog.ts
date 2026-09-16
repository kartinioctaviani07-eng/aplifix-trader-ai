import { randomUUID } from "crypto";

import { sql } from "@/lib/db/postgres";

export type AIActivityAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

export type AIActivityRisk =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface AIActivityInput {
  memberId: string;
  symbol: string;
  action: AIActivityAction;
  confidence: number;
  totalScore: number;
  price: number;
  riskLevel: AIActivityRisk;
  trend: string;
  reasons: string[];
  executionStatus:
    | "EXECUTED"
    | "NOT_EXECUTED"
    | "REJECTED";
  executionReason: string;
  decisionId: string;
  timestamp?: number;
}

class AIActivityLogService {
  async record(
    input: AIActivityInput,
  ): Promise<string> {
    const id = randomUUID();
    const timestamp =
      input.timestamp ?? Date.now();

    await sql`
      INSERT INTO ai_activity_logs (
        id,
        member_id,
        symbol,
        action,
        confidence,
        total_score,
        price,
        risk_level,
        trend,
        reasons,
        execution_status,
        execution_reason,
        decision_id,
        created_at
      )
      VALUES (
        ${id},
        ${input.memberId},
        ${input.symbol},
        ${input.action},
        ${input.confidence},
        ${input.totalScore},
        ${input.price},
        ${input.riskLevel},
        ${input.trend},
        ${JSON.stringify(input.reasons)},
        ${input.executionStatus},
        ${input.executionReason},
        ${input.decisionId},
        ${timestamp}
      )
    `;

    return id;
  }
}

export const aiActivityLog =
  new AIActivityLogService();
