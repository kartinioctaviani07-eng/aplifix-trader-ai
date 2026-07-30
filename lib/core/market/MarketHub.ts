import { MarketProvider, MarketTicker } from "./MarketProvider";

export class MarketHub {
  private providers: MarketProvider[] = [];

  register(provider: MarketProvider) {
    this.providers.push(provider);
  }

  async getTicker(symbol: string): Promise<MarketTicker> {
    const providers = this.providers.filter((p) =>
      p.supports(symbol)
    );

    if (providers.length === 0) {
      throw new Error(`No provider for ${symbol}`);
    }

    let lastError: unknown;

    for (const provider of providers) {
      try {
        return await provider.getTicker(symbol);
      } catch (error) {
        console.error(
          `${provider.name} failed for ${symbol}`,
          error
        );

        lastError = error;
      }
    }

    throw lastError ?? new Error(
      `All providers failed for ${symbol}`
    );
  }

  getProviders() {
    return this.providers;
  }
}

export const marketHub = new MarketHub();
