import {
  CandleProvider,
  Candle,
} from "./CandleProvider";


export class CandleHub {

  private providers: CandleProvider[] = [];

  private lastProvider: string | null = null;


  register(
    provider: CandleProvider
  ) {
    this.providers.push(provider);
  }


  async getCandles(
    symbol: string,
    interval: string = "1h"
  ): Promise<Candle[]> {

    const providers =
      this.providers.filter(
        (provider) =>
          provider.supports(symbol)
      );


    if (providers.length === 0) {
      throw new Error(
        `No candle provider for ${symbol}`
      );
    }


    let lastError: unknown;


    for (const provider of providers) {

      try {

        const candles =
          await provider.getCandles(
            symbol,
            interval
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


  getLastProvider() {

    return this.lastProvider;

  }


  getProviders() {

    return this.providers;

  }

}


export const candleHub =
  new CandleHub();
