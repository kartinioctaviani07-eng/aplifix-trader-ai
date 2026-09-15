export type FundamentalMarketData = {
  symbol: string;
  coinId: string;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  circulatingSupply: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  priceChange24h: number;
  marketCapRank: number | null;
  fetchedAt: number;
};

type CoinGeckoMarketRecord = {
  id?: string;
  symbol?: string;
  current_price?: number;
  market_cap?: number;
  total_volume?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  price_change_percentage_24h?: number;
  market_cap_rank?: number;
};

const COIN_IDS: Record<string, string> = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  BNBUSDT: "binancecoin",
  SOLUSDT: "solana",
  XRPUSDT: "ripple",
  DOGEUSDT: "dogecoin",
  ADAUSDT: "cardano",
};

type CacheEntry = {
  expiresAt: number;
  data: FundamentalMarketData;
};

const cache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 15 * 60 * 1000;

export class CoinGeckoFundamentalProvider {
  async getMarketData(
    symbol: string
  ): Promise<FundamentalMarketData> {
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey) {
      throw new Error(
        "COINGECKO_API_KEY is not configured"
      );
    }

    const normalizedSymbol = symbol.toUpperCase();

    const coinId = COIN_IDS[normalizedSymbol];

    if (!coinId) {
      throw new Error(
        `CoinGecko coin mapping not found for ${normalizedSymbol}`
      );
    }

    const cached = cache.get(normalizedSymbol);

    if (
      cached &&
      cached.expiresAt > Date.now()
    ) {
      return cached.data;
    }

    const url = new URL(
      "https://api.coingecko.com/api/v3/coins/markets"
    );

    url.searchParams.set(
      "vs_currency",
      "usd"
    );

    url.searchParams.set(
      "ids",
      coinId
    );

    url.searchParams.set(
      "order",
      "market_cap_desc"
    );

    url.searchParams.set(
      "per_page",
      "1"
    );

    url.searchParams.set(
      "page",
      "1"
    );

    url.searchParams.set(
      "sparkline",
      "false"
    );

    url.searchParams.set(
      "price_change_percentage",
      "24h"
    );

    const response = await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `CoinGecko market API returned ${response.status}`
      );
    }

    const payload =
      (await response.json()) as CoinGeckoMarketRecord[];

    const record = payload[0];

    if (!record) {
      throw new Error(
        `CoinGecko returned no market data for ${normalizedSymbol}`
      );
    }

    if (
      typeof record.current_price !== "number" ||
      typeof record.market_cap !== "number" ||
      typeof record.total_volume !== "number"
    ) {
      throw new Error(
        `CoinGecko returned incomplete market data for ${normalizedSymbol}`
      );
    }

    const data: FundamentalMarketData = {
      symbol: normalizedSymbol,
      coinId,
      currentPrice: record.current_price,
      marketCap: record.market_cap,
      totalVolume: record.total_volume,
      circulatingSupply:
        typeof record.circulating_supply === "number"
          ? record.circulating_supply
          : null,
      totalSupply:
        typeof record.total_supply === "number"
          ? record.total_supply
          : null,
      maxSupply:
        typeof record.max_supply === "number"
          ? record.max_supply
          : null,
      priceChange24h:
        typeof record.price_change_percentage_24h ===
        "number"
          ? record.price_change_percentage_24h
          : 0,
      marketCapRank:
        typeof record.market_cap_rank === "number"
          ? record.market_cap_rank
          : null,
      fetchedAt: Date.now(),
    };

    cache.set(normalizedSymbol, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      data,
    });

    return data;
  }
}

export const coinGeckoFundamentalProvider =
  new CoinGeckoFundamentalProvider();
