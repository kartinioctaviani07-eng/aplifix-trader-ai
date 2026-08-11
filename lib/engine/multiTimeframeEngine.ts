import {
  Candle,
  calculateIndicators,
} from "./indicatorEngine";

export interface TimeframeAnalysis {
  timeframe: string;

  trend: "Bullish" | "Bearish";

  score: number;

  confidence: number;
}

export interface MultiTimeframeResult {
  analyses: TimeframeAnalysis[];

  overallTrend: "Bullish" | "Bearish";

  averageScore: number;

  confidence: number;
}

function sampleCandles(
  candles: Candle[],
  step: number
): Candle[] {

  return candles.filter(
    (_, index) =>
      index % step === 0
  );

}

export function analyzeMultiTimeframe(
  candles: Candle[]
): MultiTimeframeResult {

  const configs = [

    {
      timeframe: "5M",
      step: 1,
    },

    {
      timeframe: "15M",
      step: 3,
    },

    {
      timeframe: "1H",
      step: 12,
    },

    {
      timeframe: "4H",
      step: 48,
    },

    {
      timeframe: "1D",
      step: 288,
    },

  ];

  const analyses: TimeframeAnalysis[] =
    configs.map((config) => {

      const sliced =
        sampleCandles(
          candles,
          config.step
        );

      const indicator =
        calculateIndicators(
          sliced.length >= 50
            ? sliced
            : candles
        );

      const score =
        indicator.trend === "Bullish"
          ? 80
          : 30;

      return {

        timeframe:
          config.timeframe,

        trend:
          indicator.trend,

        score,

        confidence:
          indicator.trendStrength,

      };

    });

  const bullish =
    analyses.filter(
      (item) =>
        item.trend === "Bullish"
    ).length;

  const bearish =
    analyses.length - bullish;

  const overallTrend =
    bullish >= bearish
      ? "Bullish"
      : "Bearish";

  const averageScore =
    Math.round(

      analyses.reduce(

        (sum, item) =>
          sum + item.score,

        0

      ) / analyses.length

    );

  const confidence =
    Math.round(

      analyses.reduce(

        (sum, item) =>
          sum + item.confidence,

        0

      ) / analyses.length

    );

  return {

    analyses,

    overallTrend,

    averageScore,

    confidence,

  };

}
