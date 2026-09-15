export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export interface CandleProvider {
  name: string;

  supports(
    symbol: string
  ): boolean;

  getCandles(
    symbol: string,
    interval: string,
    limit?: number
  ): Promise<Candle[]>;
}
