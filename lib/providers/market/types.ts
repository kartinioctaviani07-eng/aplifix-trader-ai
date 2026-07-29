export type MarketCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketTicker = {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
};

export interface MarketProvider {
  getCandles(
    symbol: string,
    interval: string
  ): Promise<MarketCandle[]>;

  getTicker(
    symbol: string
  ): Promise<MarketTicker>;
}
