import { aiBrain } from "@/lib/engine/aiBrain";
import { candleHub } from "@/lib/core/market/candleIndex";
import { marketHub } from "@/lib/core/market/MarketHub";

export interface MarketScanResult {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
  technicalScore: number;
  consensusScore: number;
  sentimentScore: number;
  fundamentalScore: number;
  macroScore: number;
  riskScore: number;
  trend: string;
  action: string;
  confidence: number;
  reason: string[];
}

const DEFAULT_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "LINKUSDT",
  "AVAXUSDT",
  "SUIUSDT",
];

export class MarketScanner {
  async scan(
    symbols: string[] = DEFAULT_SYMBOLS
  ): Promise<MarketScanResult[]> {
    const results: MarketScanResult[] = [];

    const scannedMarkets = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const ticker =
            await marketHub.getTicker(symbol);

          const candles =
            await candleHub.getCandles(
              symbol,
              "1h"
            );

          const analysis =
            await aiBrain.analyze(
              symbol,
              candles
            );

          return {
            symbol,
            price: ticker.price,
            change24h: ticker.changePercent,
            volume: ticker.volume,
            score: analysis.decision.totalScore,
            technicalScore:
              analysis.marketScore.technicalScore,
            consensusScore:
              analysis.consensus.score,
            sentimentScore:
              analysis.sentiment.score,
            fundamentalScore:
              analysis.fundamental.score,
            macroScore:
              analysis.macro.score,
            riskScore:
              analysis.risk.riskScore,
            trend:
              analysis.multiTimeframe.overallTrend,
            action:
              analysis.decision.action,
            confidence:
              analysis.decision.confidence,
            reason:
              analysis.decision.reason,
          };
        } catch (error) {
          console.error(
            `SCANNER ERROR ${symbol}:`,
            error
          );

          return null;
        }
      })
    );

    for (const market of scannedMarkets) {
      if (market !== null) {
        results.push(market);
      }
    }

    results.sort(
      (a, b) =>
        b.confidence - a.confidence ||
        b.score - a.score
    );

    return results;
  }
}

export const marketScanner =
  new MarketScanner();
