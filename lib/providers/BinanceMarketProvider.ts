import {
  MarketProvider,
  MarketTicker,
} from "@/lib/core/market/MarketProvider";

const BASE_URL = "https://api.binance.com";

export class BinanceMarketProvider
  implements MarketProvider
{
  name = "Binance";

  supports(symbol: string): boolean {
    return symbol.endsWith("USDT");
  }

  async getTicker(
    symbol: string
  ): Promise<MarketTicker> {

    const response = await fetch(
      `${BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Binance fetch failed"
      );
    }

    const data =
      await response.json();

    const price =
      Number(data.lastPrice);

    return {
      symbol: data.symbol,
      name: data.symbol,
      market: "crypto",

      price,

      change:
        Number(data.priceChange),

      changePercent:
        Number(data.priceChangePercent),

      high:
        Number(data.highPrice),

      low:
        Number(data.lowPrice),

      open:
        Number(data.openPrice),

      volume:
        Number(data.volume),

      timestamp:
        Date.now(),
    };
  }


  async search(query: string) {
    return [
      {
        symbol:
          query.toUpperCase(),

        name:
          query.toUpperCase(),

        market:
          "crypto" as const,
      },
    ];
  }
}
