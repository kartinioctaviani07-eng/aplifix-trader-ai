import { IndicatorResult } from "./indicatorEngine";

export type AIResult = {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string[];
};

export function analyzeMarket(
  indicators: IndicatorResult
): AIResult {
  if (indicators.trend === "Bullish") {
    return {
      signal: "BUY",
      confidence: 85,
      reason: [
        "EMA20 berada di atas EMA50",
        "Trend pasar sedang Bullish",
      ],
    };
  }

  return {
    signal: "SELL",
    confidence: 82,
    reason: [
      "EMA20 berada di bawah EMA50",
      "Trend pasar sedang Bearish",
    ],
  };
}
