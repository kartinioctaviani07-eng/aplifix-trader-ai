export type MACDResult = {
  macd: number;
  signal: number;
  histogram: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
};

function calculateEMA(
  values: number[],
  period: number
): number {

  if (
    values.length === 0
  ) {

    return 0;

  }

  const multiplier =
    2 / (period + 1);

  let ema =
    values[0];

  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    ema =
      values[i] *
        multiplier +
      ema *
        (1 - multiplier);

  }

  return ema;

}

export function calculateMACD(
  closes: number[]
): MACDResult {

  if (
    closes.length < 35
  ) {

    return {

      macd: 0,

      signal: 0,

      histogram: 0,

      trend: "NEUTRAL",

    };

  }

  const ema12 =
    calculateEMA(
      closes,
      12
    );

  const ema26 =
    calculateEMA(
      closes,
      26
    );

  const macd =
    ema12 - ema26;

  const macdSeries =
    closes.map(() => macd);

  const signal =
    calculateEMA(
      macdSeries,
      9
    );

  const histogram =
    macd - signal;

  let trend:
    | "BULLISH"
    | "BEARISH"
    | "NEUTRAL";

  if (
    histogram > 0
  ) {

    trend = "BULLISH";

  } else if (
    histogram < 0
  ) {

    trend = "BEARISH";

  } else {

    trend = "NEUTRAL";

  }

  return {

    macd:
      Number(
        macd.toFixed(2)
      ),

    signal:
      Number(
        signal.toFixed(2)
      ),

    histogram:
      Number(
        histogram.toFixed(2)
      ),

    trend,

  };

}
