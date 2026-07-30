import {
  calculateIndicators,
} from "@/lib/engine/indicatorEngine";

import {
  calculateRSI,
} from "@/lib/engine/rsiEngine";

import {
  calculateMACD,
} from "@/lib/engine/macdEngine";

import { Candle } from "./candleService";

export type TechnicalAnalysis = {
  indicators: ReturnType<
    typeof calculateIndicators
  >;

  rsi: ReturnType<
    typeof calculateRSI
  >;

  macd: ReturnType<
    typeof calculateMACD
  >;

  technicalScore: number;
};

class TechnicalAnalysisService {

  analyze(
    candles: Candle[]
  ): TechnicalAnalysis {

    const indicators =
      calculateIndicators(
        candles
      );

    const closes =
      candles.map(
        (c) => c.close
      );

    const rsi =
      calculateRSI(
        closes
      );

    const macd =
      calculateMACD(
        closes
      );

    let score = 50;

    if (
      indicators.trend ===
      "Bullish"
    ) {
      score += 15;
    } else {
      score -= 15;
    }

    if (
      rsi.status ===
      "OVERSOLD"
    ) {
      score += 10;
    }

    if (
      rsi.status ===
      "OVERBOUGHT"
    ) {
      score -= 10;
    }

    if (
      macd.trend ===
      "BULLISH"
    ) {
      score += 15;
    }

    if (
      macd.trend ===
      "BEARISH"
    ) {
      score -= 15;
    }

    score = Math.max(
      0,
      Math.min(
        100,
        score
      )
    );

    return {
      indicators,
      rsi,
      macd,
      technicalScore:
        score,
    };

  }

}

export const
technicalAnalysisService =
new TechnicalAnalysisService();
