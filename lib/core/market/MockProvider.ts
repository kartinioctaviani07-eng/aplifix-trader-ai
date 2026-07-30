import {
  MarketProvider,
  MarketTicker,
  MarketType,
} from "./MarketProvider";

export class MockProvider implements MarketProvider {
  name = "Mock Provider";

  supports(symbol: string): boolean {
    return true;
  }

  async getTicker(symbol: string): Promise<MarketTicker> {
    const market = this.detectMarket(symbol);

    const base =
      market === "crypto"
        ? 68000
        : market === "stock"
        ? 50000
        : 1500;

    const price = base + Math.random() * 1000;

    return {
      symbol,
      name: symbol,
      market,

      price,
      change: price * 0.0125,
      changePercent: 1.25,

      high: price + 500,
      low: price - 500,
      open: price - 100,

      volume: Math.random() * 1000000,

      timestamp: Date.now(),
    };
  }

  async search(query: string) {
    return [
      {
        symbol: query.toUpperCase(),
        name: query.toUpperCase(),
        market: this.detectMarket(query),
      },
    ];
  }

  private detectMarket(symbol: string): MarketType {
    if (symbol.endsWith("USDT")) {
      return "crypto";
    }

    return "stock";
  }
}

export const mockProvider = new MockProvider();
