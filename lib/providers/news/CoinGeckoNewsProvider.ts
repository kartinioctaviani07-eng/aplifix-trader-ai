import {
  NewsItem,
  NewsProvider,
} from "./NewsProvider";

type CoinGeckoNewsRecord = {
  id?: string;
  title?: string;
  description?: string;
  url?: string;
  updated_at?: string | number;
  published_at?: string | number;
  source?: string;
  author?: string;
};

type CoinGeckoNewsResponse = {
  data?: CoinGeckoNewsRecord[];
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
  news: NewsItem[];
};

const cache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 10 * 60 * 1000;

function toTimestamp(
  value: string | number | undefined
): number {
  if (typeof value === "number") {
    return value < 10_000_000_000
      ? value * 1000
      : value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return Date.now();
}

function detectSentiment(
  title: string,
  description: string
): NewsItem["sentiment"] {
  const text = `${title} ${description}`.toLowerCase();

  const positiveWords = [
    "surge",
    "surges",
    "rally",
    "bullish",
    "bull",
    "gain",
    "gains",
    "rise",
    "rises",
    "rising",
    "growth",
    "breakout",
    "positive",
    "adoption",
    "approval",
    "approve",
    "record high",
    "partnership",
    "inflow",
  ];

  const negativeWords = [
    "crash",
    "crashes",
    "bearish",
    "bear",
    "drop",
    "drops",
    "fall",
    "falls",
    "falling",
    "loss",
    "losses",
    "decline",
    "negative",
    "sell-off",
    "selloff",
    "hack",
    "hacked",
    "lawsuit",
    "outflow",
    "liquidation",
  ];

  const positiveScore = positiveWords.filter(
    (word) => text.includes(word)
  ).length;

  const negativeScore = negativeWords.filter(
    (word) => text.includes(word)
  ).length;

  if (positiveScore > negativeScore) {
    return "POSITIVE";
  }

  if (negativeScore > positiveScore) {
    return "NEGATIVE";
  }

  return "NEUTRAL";
}

function normalizeNews(
  records: CoinGeckoNewsRecord[]
): NewsItem[] {
  return records
    .filter(
      (record) =>
        typeof record.title === "string" &&
        record.title.trim().length > 0
    )
    .map((record, index) => {
      const title = record.title?.trim() ?? "";
      const description =
        record.description?.trim() ?? "";

      return {
        id:
          record.id ??
          `coingecko-${index}-${Date.now()}`,
        title,
        summary:
          description.length > 0
            ? description
            : title,
        source:
          record.source ??
          "CoinGecko",
        url:
          record.url ??
          "https://www.coingecko.com/",
        publishedAt: toTimestamp(
          record.published_at ??
            record.updated_at
        ),
        sentiment: detectSentiment(
          title,
          description
        ),
      };
    });
}

export class CoinGeckoNewsProvider
  implements NewsProvider {
  name = "CoinGecko News";

  async getNews(
    symbol: string
  ): Promise<NewsItem[]> {
    const apiKey =
      process.env.COINGECKO_API_KEY;

    if (!apiKey) {
      throw new Error(
        "COINGECKO_API_KEY is not configured"
      );
    }

    const coinId = COIN_IDS[symbol.toUpperCase()];

    if (!coinId) {
      throw new Error(
        `CoinGecko coin mapping not found for ${symbol}`
      );
    }

    const cached = cache.get(symbol);

    if (
      cached &&
      cached.expiresAt > Date.now()
    ) {
      return cached.news;
    }

    const url = new URL(
      "https://api.coingecko.com/api/v3/news"
    );

    url.searchParams.set(
      "coin_ids",
      coinId
    );

    url.searchParams.set(
      "per_page",
      "10"
    );

    url.searchParams.set(
      "page",
      "1"
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
        `CoinGecko News API returned ${response.status}`
      );
    }

    const payload =
      (await response.json()) as CoinGeckoNewsResponse;

    const news = normalizeNews(
      payload.data ?? []
    );

    if (news.length === 0) {
      throw new Error(
        `CoinGecko returned no news for ${symbol}`
      );
    }

    cache.set(symbol, {
      expiresAt:
        Date.now() + CACHE_TTL_MS,
      news,
    });

    return news;
  }
}

export const coinGeckoNewsProvider =
  new CoinGeckoNewsProvider();
