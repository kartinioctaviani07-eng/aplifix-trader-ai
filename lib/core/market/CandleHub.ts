import {
  CandleProvider,
  Candle,
} from "./CandleProvider";

export class CandleHub {
  private providers: CandleProvider[] = [];

  private lastProvider:
    | string
    | null = null;

  register(
    provider: CandleProvider
  ): void {
    this.providers.push(provider);
  }

  async getCandles(
    symbol: string,
    interval = "1h",
    limit = 100
  ): Promise<Candle[]> {
    const safeLimit = Math.min(
      Math.max(
        Math.floor(limit),
        1
      ),
      1000
    );

    const providers =
      this.providers.filter(
        (provider) =>
          provider.supports(symbol)
      );

    if (
      providers.length === 0
    ) {
      throw new Error(
        `No candle provider for ${symbol}`
      );
    }

    let lastError: unknown;

    for (
      const provider of providers
    ) {
      try {
        const candles =
          await provider.getCandles(
            symbol,
            interval,
            safeLimit
          );

        this.lastProvider =
          provider.name;

        return candles;
      } catch (error) {
        console.error(
          `${provider.name} candle failed`,
          error
        );

        lastError = error;
      }
    }

    this.lastProvider = null;

    throw (
      lastError ??
      new Error(
        "All candle providers failed"
      )
    );
  }

  getLastProvider():
    | string
    | null {
    return this.lastProvider;
  }

  getProviders():
    CandleProvider[] {
    return this.providers;
  }
}

export const candleHub =
  new CandleHub();
