import { calculateRSI } from "./rsiEngine";
import { calculateMACD } from "./macdEngine";
import { calculateATR } from "./atrEngine";
import { calculateADX } from "./adxEngine";

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type IndicatorResult = {

  ema20: number;

  ema50: number;

  ema200: number;

  trend: "Bullish" | "Bearish";

  rsi: number;

  macd: number;

  signal: number;

  histogram: number;

  atr: number;

  atrPercent: number;

  volatility:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  adx: number;

  trendStrength:
    | "WEAK"
    | "MODERATE"
    | "STRONG";

};

function calculateEMA(

  period: number,

  candles: Candle[]

): number {

  const closes =
    candles.map(
      candle => candle.close
    );

  if (
    closes.length === 0
  ) {

    return 0;

  }

  const multiplier =
    2 /
    (period + 1);

  let ema =
    closes[0];

  for (
    let i = 1;
    i < closes.length;
    i++
  ) {

    ema =
      closes[i] *
      multiplier +
      ema *
      (1 - multiplier);

  }

  return Number(
    ema.toFixed(2)
  );

}

export function calculateIndicators(

  candles: Candle[]

): IndicatorResult {

  const closes =
    candles.map(
      candle => candle.close
    );

  const highs =
    candles.map(
      candle => candle.high
    );

  const lows =
    candles.map(
      candle => candle.low
    );

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

  const ema200 =
    calculateEMA(
      200,
      candles
    );

  const rsi =
    calculateRSI(
      closes
    );

  const macd =
    calculateMACD(
      closes
    );

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

  return {

    ema20,

    ema50,

    ema200,

    trend:
      ema20 >= ema50
        ? "Bullish"
        : "Bearish",

    rsi:
      rsi.value,

    macd:
      macd.macd,

    signal:
      macd.signal,

    histogram:
      macd.histogram,

    atr:
      atr.value,

    atrPercent:
      atr.percent,

    volatility:
      atr.volatility,

    adx:
      adx.adx,

    trendStrength:
      adx.strength,

  };

}
