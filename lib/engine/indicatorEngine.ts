import { Candle } from "../marketData";

export type IndicatorResult = {
  ema20: number;
  ema50: number;
  trend: "Bullish" | "Bearish";
};

function calculateEMA(period: number, candles: Candle[]): number {
  const closes = candles.map((c) => c.close);

  if (closes.length === 0) {
    return 0;
  }

  const slice = closes.slice(-period);

  const total = slice.reduce((sum, value) => sum + value, 0);

  return Number((total / slice.length).toFixed(2));
}

export function calculateIndicators(
  candles: Candle[]
): IndicatorResult {
  const ema20 = calculateEMA(20, candles);
  const ema50 = calculateEMA(50, candles);

  return {
    ema20,
    ema50,
    trend: ema20 >= ema50 ? "Bullish" : "Bearish",
  };
}
