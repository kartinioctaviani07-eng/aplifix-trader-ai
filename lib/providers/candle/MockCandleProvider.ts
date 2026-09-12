import {
  CandleProvider,
  Candle,
} from "@/lib/core/market/CandleProvider";

type MarketProfile = {
  basePrice: number;
  drift: number;
  volatility: number;
};

const MARKET_PROFILES: Record<
  string,
  MarketProfile
> = {
  BTCUSDT: {
    basePrice: 68000,
    drift: 0.0008,
    volatility: 0.006,
  },

  ETHUSDT: {
    basePrice: 3500,
    drift: 0.0006,
    volatility: 0.007,
  },

  BNBUSDT: {
    basePrice: 600,
    drift: 0.0005,
    volatility: 0.008,
  },

  SOLUSDT: {
    basePrice: 170,
    drift: 0.0007,
    volatility: 0.009,
  },

  XRPUSDT: {
    basePrice: 0.5,
    drift: 0.0004,
    volatility: 0.01,
  },

  ADAUSDT: {
    basePrice: 0.8,
    drift: 0.0003,
    volatility: 0.01,
  },

  DOGEUSDT: {
    basePrice: 0.15,
    drift: 0.0002,
    volatility: 0.012,
  },

  AVAXUSDT: {
    basePrice: 35,
    drift: 0.0005,
    volatility: 0.009,
  },

  LINKUSDT: {
    basePrice: 15,
    drift: 0.0005,
    volatility: 0.008,
  },

  SUIUSDT: {
    basePrice: 2,
    drift: 0.0007,
    volatility: 0.011,
  },
};

function getProfile(
  symbol: string
): MarketProfile {
  return (
    MARKET_PROFILES[symbol] ?? {
      basePrice: 100,
      drift: 0.0003,
      volatility: 0.01,
    }
  );
}

function deterministicWave(
  index: number
): number {

  return (
    Math.sin(index * 1.73) * 0.55 +
    Math.sin(index * 0.47) * 0.3 +
    Math.cos(index * 2.31) * 0.15
  );
}

export class MockCandleProvider
  implements CandleProvider
{
  name = "Mock Candle";

  supports(
    _symbol: string
  ): boolean {
    return true;
  }

  async getCandles(
    symbol: string,
    _interval = "1h"
  ): Promise<Candle[]> {

    const profile =
      getProfile(symbol);

    const now =
      Math.floor(
        Date.now() / 3600
      ) * 3600;

    const candles: Candle[] = [];

    let price =
      profile.basePrice;

    for (
      let index = 0;
      index < 100;
      index++
    ) {

      const wave =
        deterministicWave(
          index
        );

      const movement =
        profile.drift +
        wave *
        profile.volatility;

      const open =
        price;

      const close =
        open *
        (1 + movement);

      const range =
        Math.abs(
          close - open
        ) +
        open *
        profile.volatility *
        0.35;

      const high =
        Math.max(
          open,
          close
        ) +
        range *
        0.35;

      const low =
        Math.max(
          0.00000001,
          Math.min(
            open,
            close
          ) -
          range *
          0.35
        );

      candles.push({
        time:
          now -
          (99 - index) *
          3600,

        open:
          Number(
            open.toFixed(8)
          ),

        high:
          Number(
            high.toFixed(8)
          ),

        low:
          Number(
            low.toFixed(8)
          ),

        close:
          Number(
            close.toFixed(8)
          ),
      });

      price =
        close;
    }

    return candles;
  }
}
