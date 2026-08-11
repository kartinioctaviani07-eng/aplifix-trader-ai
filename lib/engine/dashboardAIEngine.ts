import { aiCore } from "./aiCore";

export interface DashboardAIData {

  symbol: string;

  action: string;

  confidence: number;

  technicalScore: number;

  trend: string;

  trendStrength: number;

  sentiment: number;

  risk: string;

  atr: number;

  adx: number;

  reasons: string[];

  updatedAt: number;

}

export async function getDashboardAIData(
  symbol: string
): Promise<DashboardAIData> {

  const result =
    await aiCore.analyze(
      symbol
    );

  return {

    symbol,

    action:
      result.brain.decision.action,

    confidence:
      result.brain.decision.confidence,

    technicalScore:
      result.brain.marketScore
        .technicalScore,

    trend:
      result.brain.technical
        .trend,

    trendStrength:
      result.brain.technical
        .trendStrength,

    sentiment:
      result.brain.sentiment
        .score,

    risk:
      result.brain.risk.level,

    atr:
      result.brain.technical
        .atr,

    adx:
      result.brain.technical
        .adx,

    reasons:
      result.brain.marketScore
        .reasons,

    updatedAt:
      Date.now(),

  };

}
