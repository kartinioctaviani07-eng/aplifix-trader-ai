export interface PatternResult {

  bullish: boolean;

  bearish: boolean;

  sideways: boolean;

  breakout: boolean;

  breakdown: boolean;

  trend: string;

  strength: number;

  reasons: string[];

}

export function detectPattern(

  ema20: number,

  ema50: number,

  rsi: number,

  macd: number,

  signal: number,

  volumeNow: number,

  volumeAverage: number

): PatternResult {

  const reasons: string[] = [];

  let bullish = false;

  let bearish = false;

  let sideways = false;

  let breakout = false;

  let breakdown = false;

  let strength = 50;

  if (

    ema20 > ema50 &&

    macd > signal

  ) {

    bullish = true;

    strength += 20;

    reasons.push(

      "EMA Bullish Cross"

    );

  }

  if (

    ema20 < ema50 &&

    macd < signal

  ) {

    bearish = true;

    strength += 20;

    reasons.push(

      "EMA Bearish Cross"

    );

  }

  if (

    rsi >= 45 &&

    rsi <= 55

  ) {

    sideways = true;

    reasons.push(

      "RSI Sideways"

    );

  }

  if (

    volumeNow >

    volumeAverage * 1.5

  ) {

    if (bullish) {

      breakout = true;

      strength += 15;

      reasons.push(

        "Volume Breakout"

      );

    }

    if (bearish) {

      breakdown = true;

      strength += 15;

      reasons.push(

        "Volume Breakdown"

      );

    }

  }

  if (

    rsi > 70

  ) {

    reasons.push(

      "RSI Overbought"

    );

  }

  if (

    rsi < 30

  ) {

    reasons.push(

      "RSI Oversold"

    );

  }

  let trend = "SIDEWAYS";

  if (bullish) {

    trend = "BULLISH";

  }

  if (bearish) {

    trend = "BEARISH";

  }

  strength = Math.min(

    100,

    Math.max(

      0,

      strength

    )

  );

  return {

    bullish,

    bearish,

    sideways,

    breakout,

    breakdown,

    trend,

    strength,

    reasons,

  };

}
