export type ATRResult = {
  value: number;
  volatility: "LOW" | "MEDIUM" | "HIGH";
};

export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): ATRResult {

  if (
    highs.length < period + 1 ||
    lows.length < period + 1 ||
    closes.length < period + 1
  ) {
    return {
      value: 0,
      volatility: "LOW",
    };
  }

  const trueRanges: number[] = [];

  for (let i = 1; i < highs.length; i++) {

    const highLow =
      highs[i] - lows[i];

    const highClose =
      Math.abs(
        highs[i] - closes[i - 1]
      );

    const lowClose =
      Math.abs(
        lows[i] - closes[i - 1]
      );

    trueRanges.push(
      Math.max(
        highLow,
        highClose,
        lowClose
      )
    );

  }

  const atrSlice =
    trueRanges.slice(-period);

  const atr =
    atrSlice.reduce(
      (sum, value) => sum + value,
      0
    ) / period;

  let volatility:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  if (atr < 200)
    volatility = "LOW";
  else if (atr < 500)
    volatility = "MEDIUM";
  else
    volatility = "HIGH";

  return {
    value: Number(atr.toFixed(2)),
    volatility,
  };

}
