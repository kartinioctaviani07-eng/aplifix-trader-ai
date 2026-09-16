import "@/lib/core/market/candleIndex";

import { candleHub } from "@/lib/core/market/CandleHub";

import { technicalAnalysisService } from "./technicalAnalysisService";

import { marketScoreService } from "./marketScoreService";

import { makeDecision } from "@/lib/engine/decisionEngine";

import { calculateRisk } from "@/lib/engine/riskEngine";

import { generateSignal } from "@/lib/engine/signalEngine";

import { aiMemory } from "@/lib/engine/aiMemory";

class AnalysisService {
  async analyze(
    symbol: string = "BTCUSDT",
  ) {
    const candles =
      await candleHub.getCandles(
        symbol,
        "1h",
      );

    const technical =
      technicalAnalysisService.analyze(
        candles,
      );

    const scores =
      await marketScoreService.getScores(
        symbol,
      );

    const risk =
      calculateRisk({
        volatility: 2,
        stopLossPercent: 3,
        positionSizePercent: 5,
      });

    const profitHistory =
      await aiMemory.getProfitHistory();

    const lossHistory =
      await aiMemory.getLossHistory();

    const decision =
      makeDecision({
        technicalScore:
          technical.technicalScore,

        newsScore:
          scores.newsScore,

        fundamentalScore:
          scores.fundamentalScore,

        macroScore:
          scores.macroScore,

        sentimentScore:
          scores.sentimentScore,

        riskScore:
          risk.riskScore,

        confidenceWins:
          profitHistory.length,

        confidenceLosses:
          lossHistory.length,
      });

    const signal =
      generateSignal(
        technical,
        risk,
        decision,
      );

    return {
      provider:
        candleHub.getLastProvider(),

      symbol,

      candles:
        candles.length,

      technical,

      marketScores:
        scores,

      risk,

      decision,

      signal,
    };
  }
}

export const analysisService =
  new AnalysisService();
