import { candleHub } from "@/lib/core/market/candleIndex";
import { aiBrain } from "./aiBrain";

export interface MarketOpportunity {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  score: number;
  trend: string;
  risk: string;
}

export interface MarketIntelligenceResult {
  opportunities: MarketOpportunity[];
  best: MarketOpportunity;
  generatedAt: number;
}

const WATCHLIST = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
];

class MarketIntelligenceEngine {
  async scan(): Promise<MarketIntelligenceResult> {
    const opportunities: MarketOpportunity[] = [];

    for (const symbol of WATCHLIST) {
      const candles =
        await candleHub.getCandles(
          symbol,
          "1h"
        );

      const brain =
        await aiBrain.analyze(
          symbol,
          candles
        );

      opportunities.push({
        symbol,
        action:
          brain.decision.action,
        confidence:
          brain.decision.confidence,
        score:
          brain.marketScore.technicalScore,
        trend:
          brain.technical.trend,
        risk:
          brain.risk.level,
      });
    }

    opportunities.sort(
      (a, b) =>
        b.confidence -
        a.confidence
    );

    const best =
      opportunities[0];

    if (!best) {
      throw new Error(
        "Tidak ada market opportunity yang tersedia."
      );
    }

    return {
      opportunities,
      best,
      generatedAt:
        Date.now(),
    };
  }
}

export const marketIntelligenceEngine =
  new MarketIntelligenceEngine();
