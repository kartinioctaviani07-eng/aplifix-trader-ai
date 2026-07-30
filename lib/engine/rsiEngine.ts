export type RSIResult = {
  value: number;

  status:
    | "OVERBOUGHT"
    | "OVERSOLD"
    | "NEUTRAL";
};

export function calculateRSI(
  closes: number[],
  period: number = 14
): RSIResult {

  if (closes.length <= period) {
    return {
      value: 50,
      status: "NEUTRAL",
    };
  }

  let gain = 0;
  let loss = 0;

  for (
    let i = closes.length - period;
    i < closes.length;
    i++
  ) {

    const change =
      closes[i] - closes[i - 1];

    if (change > 0) {
      gain += change;
    } else {
      loss += Math.abs(change);
    }

  }

  const avgGain =
    gain / period;

  const avgLoss =
    loss / period;

  if (avgLoss === 0) {
    return {
      value: 100,
      status: "OVERBOUGHT",
    };
  }

  const rs =
    avgGain / avgLoss;

  const rsi =
    100 -
    100 / (1 + rs);

  let status:
    | "OVERBOUGHT"
    | "OVERSOLD"
    | "NEUTRAL";

  if (rsi >= 70) {
    status = "OVERBOUGHT";
  } else if (rsi <= 30) {
    status = "OVERSOLD";
  } else {
    status = "NEUTRAL";
  }

  return {
    value:
      Number(
        rsi.toFixed(2)
      ),
    status,
  };

}
