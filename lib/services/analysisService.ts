import { candleService } from "./candleService";
import { technicalAnalysisService } from "./technicalAnalysisService";
import { makeDecision } from "@/lib/engine/decisionEngine";

class AnalysisService {
  async analyze(
    symbol: string = "BTCUSDT"
  ) {
    const candles =
      await candleService.getCandles(
        symbol
      );

    const technical =
      technicalAnalysisService.analyze(
        candles
      );

    const decision =
      makeDecision({
        technicalScore:
          technical.technicalScore,

        newsScore: 50,
        fundamentalScore: 50,
        macroScore: 50,
        sentimentScore: 50,
        riskScore: 50,
      });

    return {
      symbol,

      technical,

      decision,
    };
  }
}

export const analysisService =
  new AnalysisService();
