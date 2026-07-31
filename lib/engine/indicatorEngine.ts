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
  trend: "Bullish" | "Bearish";
};


function calculateEMA(
  period: number,
  candles: Candle[]
): number {

  const closes =
    candles.map(
      (c) => c.close
    );


  if (closes.length === 0) {
    return 0;
  }


  const multiplier =
    2 / (period + 1);


  let ema =
    closes[0];


  for (
    let i = 1;
    i < closes.length;
    i++
  ) {

    ema =
      (
        closes[i] * multiplier
      ) +
      (
        ema *
        (1 - multiplier)
      );

  }


  return Number(
    ema.toFixed(2)
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


  return {

    ema20,

    ema50,

    trend:
      ema20 >= ema50
        ? "Bullish"
        : "Bearish",

  };

}
