import {
  Candle,
  calculateIndicators,
} from "./indicatorEngine";
import { candleHub } from "@/lib/core/market/CandleHub";

export interface TimeframeAnalysis {
  timeframe: string;
  trend: "Bullish" | "Bearish";
  score: number;
  confidence: number;
  candleCount: number;
}

export interface MultiTimeframeResult {
  analyses: TimeframeAnalysis[];
  overallTrend: "Bullish" | "Bearish";
  averageScore: number;
  confidence: number;
}

type TimeframeConfig = {
  label: string;
  interval: string;
  weight: number;
};

const LIVE_TIMEFRAMES: TimeframeConfig[] = [
  {
    label: "5M",
    interval: "5m",
    weight: 0.1,
  },
  {
    label: "15M",
    interval: "15m",
    weight: 0.15,
  },
  {
    label: "1H",
    interval: "1h",
    weight: 0.25,
  },
  {
    label: "4H",
    interval: "4h",
    weight: 0.25,
  },
  {
    label: "1D",
    interval: "1d",
    weight: 0.25,
  },
];

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function calculateTimeframeScore(
  candles: Candle[]
): {
  score: number;
  confidence: number;
} {
  const indicator =
    calculateIndicators(candles);

  /*
   * Each component is normalized to 0-100.
   * This prevents one bearish/bullish signal
   * from pushing the entire timeframe score
   * toward an artificial 0 or 100.
   */

  // EMA direction: primary trend component.
  const emaScore =
    indicator.trend === "Bullish"
      ? 70
      : 30;

  // RSI: momentum / market condition.
  let rsiScore = 50;

  if (
    indicator.rsi >= 50 &&
    indicator.rsi <= 65
  ) {
    rsiScore = 70;
  } else if (
    indicator.rsi > 65 &&
    indicator.rsi <= 70
  ) {
    rsiScore = 60;
  } else if (
    indicator.rsi > 70
  ) {
    rsiScore = 45;
  } else if (
    indicator.rsi >= 35 &&
    indicator.rsi < 50
  ) {
    rsiScore = 40;
  } else if (
    indicator.rsi < 35
  ) {
    rsiScore = 55;
  }

  // MACD direction.
  const macdScore =
    indicator.macd >
    indicator.signal
      ? 65
      : 35;

  // ADX measures trend strength, not direction.
  const adxScore =
    clamp(
      50 +
        (indicator.adx - 25) * 1.5,
      35,
      80
    );

  // Candlestick confirmation.
  let candleScore = 50;

  if (
    indicator.candlePattern ===
      "HAMMER" ||
    indicator.candlePattern ===
      "BULLISH"
  ) {
    candleScore = 65;
  } else if (
    indicator.candlePattern ===
      "SHOOTING_STAR" ||
    indicator.candlePattern ===
      "BEARISH"
  ) {
    candleScore = 35;
  }

  /*
   * Weighted technical score.
   *
   * EMA      30%
   * RSI      15%
   * MACD     25%
   * ADX      15%
   * Candle   15%
   */
  const score =
    emaScore * 0.3 +
    rsiScore * 0.15 +
    macdScore * 0.25 +
    adxScore * 0.15 +
    candleScore * 0.15;

  /*
   * Confidence represents agreement between
   * directional indicators, not raw candle strength.
   */
  const directionalSignals = [
    indicator.trend === "Bullish",
    indicator.macd >
      indicator.signal,
    indicator.rsi >= 50 &&
      indicator.rsi <= 70,
    candleScore >= 60,
  ];

  const bullishSignals =
    directionalSignals.filter(
      Boolean
    ).length;

  const bearishSignals =
    directionalSignals.length -
    bullishSignals;

  const agreement =
    Math.max(
      bullishSignals,
      bearishSignals
    ) / directionalSignals.length;

  const adxConfirmation =
    clamp(
      indicator.adx / 40,
      0,
      1
    );

  const confidence = Math.round(
    (
      agreement * 0.7 +
      adxConfirmation * 0.3
    ) * 100
  );

  return {
    score: Math.round(
      clamp(score, 0, 100)
    ),
    confidence: Math.round(
      clamp(confidence, 0, 100)
    ),
  };
}

function analyzeTimeframe(
  timeframe: string,
  candles: Candle[]
): TimeframeAnalysis {
  const indicator =
    calculateIndicators(candles);

  const scoring =
    calculateTimeframeScore(
      candles
    );

  return {
    timeframe,
    trend: indicator.trend,
    score: scoring.score,
    confidence: scoring.confidence,
    candleCount: candles.length,
  };
}

function aggregateCandles(
  candles: Candle[],
  groupSize: number
): Candle[] {
  const result: Candle[] = [];

  for (
    let index = 0;
    index + groupSize <=
    candles.length;
    index += groupSize
  ) {
    const group =
      candles.slice(
        index,
        index + groupSize
      );

    const first = group[0];
    const last =
      group[group.length - 1];

    if (!first || !last) {
      continue;
    }

    result.push({
      time: first.time,
      open: first.open,
      high: Math.max(
        ...group.map(
          (candle) =>
            candle.high
        )
      ),
      low: Math.min(
        ...group.map(
          (candle) =>
            candle.low
        )
      ),
      close: last.close,
    });
  }

  return result;
}

function buildResult(
  analyses: TimeframeAnalysis[],
  weights?: Record<
    string,
    number
  >
): MultiTimeframeResult {
  const bullish =
    analyses.filter(
      (item) =>
        item.trend === "Bullish"
    ).length;

  const bearish =
    analyses.length -
    bullish;

  const overallTrend =
    bullish >= bearish
      ? "Bullish"
      : "Bearish";

  let averageScore = 50;

  if (analyses.length > 0) {
    if (weights) {
      let weightedScore = 0;
      let totalWeight = 0;

      for (const analysis of analyses) {
        const weight =
          weights[
            analysis.timeframe
          ] ?? 0;

        weightedScore +=
          analysis.score *
          weight;

        totalWeight += weight;
      }

      averageScore =
        totalWeight > 0
          ? Math.round(
              weightedScore /
                totalWeight
            )
          : 50;
    } else {
      averageScore =
        Math.round(
          analyses.reduce(
            (sum, item) =>
              sum + item.score,
            0
          ) / analyses.length
        );
    }
  }

  const confidence =
    analyses.length > 0
      ? Math.round(
          analyses.reduce(
            (sum, item) =>
              sum + item.confidence,
            0
          ) / analyses.length
        )
      : 0;

  return {
    analyses,
    overallTrend,
    averageScore,
    confidence,
  };
}

export async function analyzeMultiTimeframe(
  symbol: string
): Promise<MultiTimeframeResult> {
  const analyses =
    await Promise.all(
      LIVE_TIMEFRAMES.map(
        async (config) => {
          const candles =
            await candleHub.getCandles(
              symbol,
              config.interval
            );

          return analyzeTimeframe(
            config.label,
            candles
          );
        }
      )
    );

  const weights =
    Object.fromEntries(
      LIVE_TIMEFRAMES.map(
        (config) => [
          config.label,
          config.weight,
        ]
      )
    );

  return buildResult(
    analyses,
    weights
  );
}

export function analyzeHistoricalMultiTimeframe(
  candles: Candle[]
): MultiTimeframeResult {
  const analyses: TimeframeAnalysis[] =
    [];

  if (candles.length >= 50) {
    analyses.push(
      analyzeTimeframe(
        "1H",
        candles
      )
    );
  }

  const fourHour =
    aggregateCandles(
      candles,
      4
    );

  if (fourHour.length >= 50) {
    analyses.push(
      analyzeTimeframe(
        "4H",
        fourHour
      )
    );
  }

  const oneDay =
    aggregateCandles(
      candles,
      24
    );

  if (oneDay.length >= 50) {
    analyses.push(
      analyzeTimeframe(
        "1D",
        oneDay
      )
    );
  }

  return buildResult(
    analyses
  );
}
