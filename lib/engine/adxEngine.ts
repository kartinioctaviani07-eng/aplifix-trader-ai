export type ADXResult = {
  value: number;

  strength:
    | "WEAK"
    | "MODERATE"
    | "STRONG";
};

export function calculateADX(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): ADXResult {

  if (
    highs.length < period + 1 ||
    lows.length < period + 1 ||
    closes.length < period + 1
  ) {

    return {

      value: 0,

      strength: "WEAK",

    };

  }

  let movement = 0;

  for (
    let i = 1;
    i < highs.length;
    i++
  ) {

    movement +=
      Math.abs(
        closes[i] -
        closes[i - 1]
      );

  }

  const averageMovement =
    movement /
    (highs.length - 1);

  const latestPrice =
    closes.at(-1) ?? 1;

  const value =
    (averageMovement / latestPrice) *
    1000;

  let strength:
    | "WEAK"
    | "MODERATE"
    | "STRONG";

  if (value < 20) {

    strength = "WEAK";

  } else if (value < 40) {

    strength = "MODERATE";

  } else {

    strength = "STRONG";

  }

  return {

    value: Number(
      value.toFixed(2)
    ),

    strength,

  };

}
