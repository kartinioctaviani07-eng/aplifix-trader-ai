import db from "@/lib/db/database";
import { randomUUID } from "crypto";

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
  record(
    input: AIActivityInput,
  ): string {
    const id = randomUUID();

    const timestamp =
      input.timestamp ?? Date.now();

    db.prepare(`
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
        @id,
        @member_id,
        @symbol,
        @action,
        @confidence,
        @total_score,
        @price,
        @risk_level,
        @trend,
        @reasons,
        @execution_status,
        @execution_reason,
        @decision_id,
        @created_at
      )
    `).run({
      id,
      member_id: input.memberId,
      symbol: input.symbol,
      action: input.action,
      confidence: input.confidence,
      total_score: input.totalScore,
      price: input.price,
      risk_level: input.riskLevel,
      trend: input.trend,
      reasons: JSON.stringify(
        input.reasons,
      ),
      execution_status:
        input.executionStatus,
      execution_reason:
        input.executionReason,
      decision_id:
        input.decisionId,
      created_at: timestamp,
    });

    return id;
  }
}

export const aiActivityLog =
  new AIActivityLogService();
