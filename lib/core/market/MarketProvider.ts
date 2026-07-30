export type MarketType =
  | "stock"
  | "forex"
  | "commodity"
  | "crypto";

export interface MarketTicker {
  symbol: string;
  name: string;
  market: MarketType;

  price: number;
  change: number;
  changePercent: number;

  high: number;
  low: number;
  open: number;
  volume: number;

  timestamp: number;
}

export interface MarketProvider {
  name: string;

  supports(symbol: string): boolean;

  getTicker(symbol: string): Promise<MarketTicker>;

  search(query: string): Promise<
    {
      symbol: string;
      name: string;
      market: MarketType;
    }[]
  >;
}
