export type MACDResult = {
  macd: number;
  signal: number;
  histogram: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
};

function ema(
  values: number[],
  period: number
): number {

  if (values.length === 0)
    return 0;

  const multiplier =
    2 / (period + 1);

  let result =
    values[0];

  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    result =
      values[i] * multiplier +
      result * (1 - multiplier);

  }

  return result;
}

export function calculateMACD(
  closes: number[]
): MACDResult {

  const ema12 =
    ema(closes, 12);

  const ema26 =
    ema(closes, 26);

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

  if (macd > 0)
    trend = "BULLISH";
  else if (macd < 0)
    trend = "BEARISH";
  else
    trend = "NEUTRAL";

  return {

    macd:
      Number(macd.toFixed(2)),

    signal:
      Number(signal.toFixed(2)),

    histogram:
      Number(histogram.toFixed(2)),

    trend,

  };

}
