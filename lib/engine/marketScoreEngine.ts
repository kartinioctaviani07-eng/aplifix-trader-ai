export interface MarketScoreInput {
  trend: "Bullish" | "Bearish";

  rsi: number;

  macd: number;

  signal: number;

  adx: number;

  patternStrength: number;
}

export interface MarketScoreResult {
  technicalScore: number;

  reasons: string[];
}

export function calculateMarketScore(
  input: MarketScoreInput
): MarketScoreResult {

  let score = 50;

  const reasons: string[] = [];

  // EMA Trend
  if (input.trend === "Bullish") {

    score += 15;

    reasons.push(
      "EMA Bullish"
    );

  } else {

    score -= 15;

    reasons.push(
      "EMA Bearish"
    );

  }

  // RSI
  if (
    input.rsi >= 50 &&
    input.rsi <= 70
  ) {

    score += 10;

    reasons.push(
      "RSI sehat"
    );

  } else if (
    input.rsi > 70
  ) {

    score -= 10;

    reasons.push(
      "RSI Overbought"
    );

  } else if (
    input.rsi < 30
  ) {

    score += 10;

    reasons.push(
      "RSI Oversold"
    );

  }

  // MACD
  if (
    input.macd >
    input.signal
  ) {

    score += 10;

    reasons.push(
      "MACD Bullish"
    );

  } else {

    score -= 10;

    reasons.push(
      "MACD Bearish"
    );

  }

  // ADX
  if (
    input.adx >= 25
  ) {

    score += 10;

    reasons.push(
      "Trend kuat"
    );

  }

  // Candlestick Pattern
  score += Math.round(
    input.patternStrength / 10
  );

  reasons.push(
    "Candlestick Pattern"
  );

  score = Math.max(
    0,
    Math.min(
      100,
      score
    )
  );

  return {

    technicalScore: score,

    reasons,

  };

}
