export type ATRResult = {
  value: number;

  percent: number;

  volatility:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
};

export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): ATRResult {

  if (
    highs.length < period + 1 ||
    lows.length < period + 1 ||
    closes.length < period + 1
  ) {

    return {

      value: 0,

      percent: 0,

      volatility: "LOW",

    };

  }

  const trueRanges: number[] = [];

  for (
    let i = 1;
    i < highs.length;
    i++
  ) {

    const highLow =
      highs[i] - lows[i];

    const highClose =
      Math.abs(
        highs[i] -
        closes[i - 1]
      );

    const lowClose =
      Math.abs(
        lows[i] -
        closes[i - 1]
      );

    trueRanges.push(

      Math.max(

        highLow,

        highClose,

        lowClose

      )

    );

  }

  const atr =

    trueRanges

      .slice(-period)

      .reduce(

        (a, b) => a + b,

        0

      ) / period;

  const latestClose =
    closes.at(-1) ?? 1;

  const percent =
    (atr / latestClose) * 100;

  let volatility:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  if (
    percent < 1
  ) {

    volatility = "LOW";

  }

  else if (
    percent < 2.5
  ) {

    volatility = "MEDIUM";

  }

  else {

    volatility = "HIGH";

  }

  return {

    value:
      Number(
        atr.toFixed(2)
      ),

    percent:
      Number(
        percent.toFixed(2)
      ),

    volatility,

  };

}
