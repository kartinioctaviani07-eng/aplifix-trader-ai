import { calculateMACD } from "./macdEngine";
import { calculateATR } from "./atrEngine";
import { calculateADX } from "./adxEngine";
import { analyzeCandles } from "./candleAnalyzer";

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export interface IndicatorResult {
  ema20: number;
  ema50: number;

  trend: "Bullish" | "Bearish";

  trendStrength: number;

  rsi: number;

  macd: number;
  signal: number;

  atr: number;
  adx: number;

  candlePattern: string;
}

function calculateEMA(
  period: number,
  candles: Candle[]
): number {

  const closes = candles.map(c => c.close);

  if (!closes.length) return 0;

  const multiplier = 2 / (period + 1);

  let ema = closes[0];

  for (let i = 1; i < closes.length; i++) {
    ema =
      closes[i] * multiplier +
      ema * (1 - multiplier);
  }

  return Number(ema.toFixed(2));
}

function calculateRSI(
  closes: number[]
): number {

  if (closes.length < 15) return 50;

  let gain = 0;
  let loss = 0;

  for (
    let i = closes.length - 14;
    i < closes.length;
    i++
  ) {

    const diff =
      closes[i] -
      closes[i - 1];

    if (diff > 0)
      gain += diff;
    else
      loss += Math.abs(diff);
  }

  if (loss === 0)
    return 100;

  const rs = gain / loss;

  return Number(
    (
      100 -
      100 / (1 + rs)
    ).toFixed(2)
  );
}

export function calculateIndicators(
  candles: Candle[]
): IndicatorResult {

  const ema20 =
    calculateEMA(
      20,
      candles
    );

  const ema50 =
    calculateEMA(
      50,
      candles
    );

  const closes =
    candles.map(c => c.close);

  const highs =
    candles.map(c => c.high);

  const lows =
    candles.map(c => c.low);

  const rsi =
    calculateRSI(closes);

  const macd =
    calculateMACD(closes);

  const atr =
    calculateATR(
      highs,
      lows,
      closes
    );

  const adx =
    calculateADX(
      highs,
      lows,
      closes
    );

  const candle =
    analyzeCandles(
      candles.map(c => c.open),
      highs,
      lows,
      closes
    );

  const trend =
    ema20 >= ema50
      ? "Bullish"
      : "Bearish";

  return {

    ema20,

    ema50,

    trend,

    trendStrength:
      candle.strength,

    rsi,

    macd:
      macd.macd,

    signal:
      macd.signal,

    atr:
      atr.value,

    adx:
      adx.value,

    candlePattern:
      candle.pattern,

  };

}
