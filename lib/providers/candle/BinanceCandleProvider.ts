import {
  CandleProvider,
  Candle,
} from "@/lib/core/market/CandleProvider";

const BASE_URL =
  "https://data-api.binance.vision";

const MAX_LIMIT = 1000;

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
];

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
    interval = "1h",
    limit = 100
  ): Promise<Candle[]> {
    const safeLimit =
      Math.min(
        Math.max(
          Math.floor(limit),
          1
        ),
        MAX_LIMIT
      );

    try {
      const url =
        `${BASE_URL}/api/v3/klines` +
        `?symbol=${encodeURIComponent(
          symbol
        )}` +
        `&interval=${encodeURIComponent(
          interval
        )}` +
        `&limit=${safeLimit}`;

      const response =
        await fetch(url, {
          cache: "no-store",
        });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data: unknown =
        await response.json();

      if (
        !Array.isArray(data)
      ) {
        throw new Error(
          "Format data Binance tidak valid."
        );
      }

      return data.map(
        (item): Candle => {
          if (
            !Array.isArray(item) ||
            item.length < 5
          ) {
            throw new Error(
              "Format candle Binance tidak valid."
            );
          }

          return {
            time: Math.floor(
              Number(item[0]) / 1000
            ),
            open: Number(item[1]),
            high: Number(item[2]),
            low: Number(item[3]),
            close: Number(item[4]),
          };
        }
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
