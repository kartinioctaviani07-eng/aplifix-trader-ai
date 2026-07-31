export type MarketContext = {
  trend: "BULLISH" | "BEARISH";
  momentum: "STRONG" | "WEAK" | "NEUTRAL";
  volatility: "LOW" | "MEDIUM" | "HIGH";
  marketBias: string;
};

type Input = {
  technicalScore: number;
  rsi: number;
  macdTrend: "BULLISH" | "BEARISH" | "NEUTRAL";
};

export function buildMarketContext(
  input: Input
): MarketContext {

  const trend =
    input.technicalScore >= 50
      ? "BULLISH"
      : "BEARISH";

  let momentum:
    | "STRONG"
    | "WEAK"
    | "NEUTRAL";

  if (input.rsi >= 60)
    momentum = "STRONG";
  else if (input.rsi <= 40)
    momentum = "WEAK";
  else
    momentum = "NEUTRAL";

  let volatility:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  if (Math.abs(input.rsi - 50) < 5)
    volatility = "LOW";
  else if (Math.abs(input.rsi - 50) < 15)
    volatility = "MEDIUM";
  else
    volatility = "HIGH";

  const marketBias =
    input.macdTrend === "BULLISH"
      ? "BUYERS CONTROL"
      : input.macdTrend === "BEARISH"
      ? "SELLERS CONTROL"
      : "BALANCED";

  return {
    trend,
    momentum,
    volatility,
    marketBias,
  };
}
