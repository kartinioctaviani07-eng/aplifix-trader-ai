import { marketHub } from "@/lib/core/market";

class MarketService {
  async getTicker(symbol: string) {
    return await marketHub.getTicker(symbol);
  }

  async getWatchlist() {
    const symbols = [
      "BBCA",
      "BBRI",
      "TLKM",
      "AAPL",
      "MSFT",
      "BTCUSDT",
    ];

    return Promise.all(
      symbols.map((symbol) => this.getTicker(symbol))
    );
  }
}

export const marketService = new MarketService();
