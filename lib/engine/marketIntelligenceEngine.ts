import { aiCore } from "./aiCore";

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

      const result =
        await aiCore.analyze(symbol);

      opportunities.push({

        symbol,

        action:
          result.brain.decision.action,

        confidence:
          result.brain.decision.confidence,

        score:
          result.brain.marketScore.technicalScore,

        trend:
          result.brain.technical.trend,

        risk:
          result.brain.risk.level,

      });

    }

    opportunities.sort(

      (a, b) =>

        b.confidence - a.confidence

    );

    return {

      opportunities,

      best: opportunities[0],

      generatedAt: Date.now(),

    };

  }

}

export const marketIntelligenceEngine =
  new MarketIntelligenceEngine();
