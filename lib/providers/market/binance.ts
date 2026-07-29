import {
  MarketProvider,
  MarketCandle,
  MarketTicker,
} from "./types";

export class BinanceProvider implements MarketProvider {
  async getCandles(
    symbol: string,
    interval: string
  ): Promise<MarketCandle[]> {
    console.log(
      `[Binance] getCandles: ${symbol} (${interval})`
    );

    return [];
  }

  async getTicker(
    symbol: string
  ): Promise<MarketTicker> {
    console.log(
      `[Binance] getTicker: ${symbol}`
    );

    return {
      symbol,
      price: 0,
      change24h: 0,
      volume24h: 0,
    };
  }
}
