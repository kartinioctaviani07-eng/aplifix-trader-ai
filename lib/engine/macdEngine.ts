export type MACDResult = {
  macd: number;
  signal: number;
  histogram: number;

  trend:
    | "BULLISH"
    | "BEARISH"
    | "NEUTRAL";
};

function calculateEMA(
  values: number[],
  period: number
): number {

  if (values.length === 0) {
    return 0;
  }

  const slice =
    values.slice(-period);

  const total =
    slice.reduce(
      (sum, value) => sum + value,
      0
    );

  return total / slice.length;
}

export function calculateMACD(
  closes: number[]
): MACDResult {

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

  const signal =
    macd;

  const histogram =
    macd - signal;

  let trend:
    | "BULLISH"
    | "BEARISH"
    | "NEUTRAL";

  if (macd > 0) {
    trend = "BULLISH";
  } else if (macd < 0) {
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
