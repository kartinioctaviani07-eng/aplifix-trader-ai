import { marketHub } from "@/lib/core/market/MarketHub";

export interface MarketScanResult {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  score: number;
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

    for (const symbol of symbols) {

      try {

        const ticker =
          await marketHub.getTicker(symbol);

        const score =
          this.calculateScore(
            ticker.changePercent,
            ticker.volume
          );

        results.push({
          symbol,
          price: ticker.price,
          change24h: ticker.changePercent,
          volume: ticker.volume,
          score,
        });

      } catch {

        continue;

      }

    }

    results.sort(
      (a, b) => b.score - a.score
    );

    return results;

  }

  private calculateScore(
    change: number,
    volume: number
  ) {

    const changeScore =
      Math.min(
        40,
        Math.max(
          0,
          change * 4
        )
      );

    const volumeScore =
      Math.min(
        60,
        volume / 1000000
      );

    return Math.round(
      changeScore +
      volumeScore
    );

  }

}

export const marketScanner =
  new MarketScanner();
