export interface CandlePatternResult {
  pattern: string;
  bullish: boolean;
  bearish: boolean;
  strength: number;
}

export function analyzeCandles(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[]
): CandlePatternResult {

  const last = closes.length - 1;

  if (last < 1) {
    return {
      pattern: "UNKNOWN",
      bullish: false,
      bearish: false,
      strength: 0,
    };
  }

  const open = opens[last];
  const close = closes[last];
  const high = highs[last];
  const low = lows[last];

  const body = Math.abs(close - open);
  const upperShadow = high - Math.max(open, close);
  const lowerShadow = Math.min(open, close) - low;

  // Hammer
  if (
    lowerShadow > body * 2 &&
    upperShadow < body
  ) {
    return {
      pattern: "HAMMER",
      bullish: true,
      bearish: false,
      strength: 80,
    };
  }

  // Shooting Star
  if (
    upperShadow > body * 2 &&
    lowerShadow < body
  ) {
    return {
      pattern: "SHOOTING_STAR",
      bullish: false,
      bearish: true,
      strength: 80,
    };
  }

  // Bullish Candle
  if (close > open) {
    return {
      pattern: "BULLISH",
      bullish: true,
      bearish: false,
      strength: 60,
    };
  }

  // Bearish Candle
  if (close < open) {
    return {
      pattern: "BEARISH",
      bullish: false,
      bearish: true,
      strength: 60,
    };
  }

  return {
    pattern: "DOJI",
    bullish: false,
    bearish: false,
    strength: 40,
  };
}
