import {
  CandleProvider,
  Candle,
} from "@/lib/core/market/CandleProvider";

const BASE_URL =
  "https://api.binance.com";

export class BinanceCandleProvider
  implements CandleProvider
{
  name = "Binance Candle";

  supports(
    symbol: string
  ): boolean {
    return symbol.endsWith("USDT");
  }

  async getCandles(
    symbol: string,
    interval: string = "1h"
  ): Promise<Candle[]> {

    try {

      const response =
        await fetch(
          `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`,
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
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
        "BINANCE PROVIDER ERROR:",
        error
      );

      throw error;

    }

  }

}
