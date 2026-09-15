import { candleHub } from "@/lib/core/market/candleIndex";
import { aiBrain } from "@/lib/engine/aiBrain";

const DEMO_AGGRESSIVE_THRESHOLD = 60;

export type DemoWorkerAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

export interface DemoWorkerDecision {
  memberId: string;
  symbol: string;
  decisionId: string;
  action: DemoWorkerAction;
  confidence: number;
  totalScore: number;
  price: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  trend: string;
  reasons: string[];
  timestamp: number;
}

class DemoWorker {
  async analyze(
    memberId: string,
    symbol: string,
  ): Promise<DemoWorkerDecision> {
    if (!memberId.trim()) {
      throw new Error(
        "Member ID wajib diisi.",
      );
    }

    const normalizedSymbol =
      symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      throw new Error(
        "Symbol wajib diisi.",
      );
    }

    const candles =
      await candleHub.getCandles(
        normalizedSymbol,
        "1h",
      );

    const lastCandle =
      candles.at(-1);

    if (!lastCandle) {
      throw new Error(
        `Tidak ada candle untuk ${normalizedSymbol}.`,
      );
    }

    const brain =
      await aiBrain.analyze(
        normalizedSymbol,
        candles,
      );

    const originalAction =
      brain.decision.action;

    const aggressiveEligible =
      brain.decision.confidence >=
        DEMO_AGGRESSIVE_THRESHOLD &&
      brain.decision.totalScore >=
        DEMO_AGGRESSIVE_THRESHOLD &&
      brain.risk.level !== "HIGH";

    let action: DemoWorkerAction =
      originalAction;

    const reasons = [
      ...brain.decision.reason,
    ];

    if (
      aggressiveEligible &&
      (originalAction === "WAIT" ||
        originalAction === "HOLD")
    ) {
      action = "BUY";

      reasons.push(
        `Demo Aggressive Policy: score ${brain.decision.totalScore} dan confidence ${brain.decision.confidence} memenuhi threshold ${DEMO_AGGRESSIVE_THRESHOLD}.`,
      );

      reasons.push(
        "Demo virtual mengizinkan entry BUY lebih agresif untuk simulasi marketing.",
      );
    }

    return {
      memberId,
      symbol: normalizedSymbol,
      decisionId:
        brain.decision.id,
      action,
      confidence:
        brain.decision.confidence,
      totalScore:
        brain.decision.totalScore,
      price:
        lastCandle.close,
      riskLevel:
        brain.risk.level,
      trend:
        brain.technical.trend,
      reasons,
      timestamp:
        Date.now(),
    };
  }
}

export const demoWorker =
  new DemoWorker();
