export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};


class CandleService {

  private fallbackCandles(): Candle[] {
    const now =
      Math.floor(Date.now() / 1000);

    const candles: Candle[] = [];

    let price = 68000;

    for (let i = 50; i >= 0; i--) {
      const open = price;

      const move =
        Math.floor(
          Math.random() * 800 - 400
        );

      const close =
        open + move;

      const high =
        Math.max(open, close) +
        Math.floor(Math.random() * 300);

      const low =
        Math.min(open, close) -
        Math.floor(Math.random() * 300);


      candles.push({
        time:
          now - i * 3600,

        open,

        high,

        low,

        close,
      });


      price = close;
    }

    return candles;
  }


  async getCandles(
    symbol: string = "BTCUSDT",
    interval: string = "1h"
  ): Promise<Candle[]> {

    try {

      const response =
        await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`,
          {
            cache: "no-store",
          }
        );


      if (!response.ok) {
        throw new Error(
          "Failed fetch candles"
        );
      }


      const data =
        await response.json();


      return data.map(
        (item: any[]) => ({
          time:
            Math.floor(
              Number(item[0]) / 1000
            ),

          open:
            Number(item[1]),

          high:
            Number(item[2]),

          low:
            Number(item[3]),

          close:
            Number(item[4]),
        })
      );


    } catch (error) {

      console.error(
        "Binance candle failed, using fallback:",
        error
      );


      return this.fallbackCandles();

    }
  }
}


export const candleService =
  new CandleService();
