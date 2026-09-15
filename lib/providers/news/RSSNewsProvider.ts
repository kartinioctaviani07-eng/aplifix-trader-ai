import type {
  NewsItem,
  NewsProvider,
} from "./NewsProvider";

type RSSArticle = {
  title: string;
  summary: string;
  url: string;
  publishedAt: number;
};

const SOURCE_FEEDS = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  },
  {
    name: "Cointelegraph",
    url: "https://cointelegraph.com/rss",
  },
];

const SYMBOL_KEYWORDS: Record<string, string[]> = {
  BTCUSDT: ["bitcoin", "btc"],
  ETHUSDT: ["ethereum", "eth"],
  BNBUSDT: ["binance", "bnb"],
  SOLUSDT: ["solana", "sol"],
  XRPUSDT: ["xrp", "ripple"],
  DOGEUSDT: ["dogecoin", "doge"],
  ADAUSDT: ["cardano", "ada"],
};

const POSITIVE_WORDS = [
  "surge",
  "surges",
  "rally",
  "rallies",
  "bullish",
  "gain",
  "gains",
  "rise",
  "rises",
  "rising",
  "up",
  "positive",
  "growth",
  "adoption",
  "breakout",
  "record high",
  "approval",
  "approved",
  "increase",
  "increased",
  "strong",
  "recovery",
  "recover",
  "inflow",
  "inflows",
  "institutional buying",
  "buying pressure",
];

const NEGATIVE_WORDS = [
  "crash",
  "drop",
  "drops",
  "fall",
  "falls",
  "falling",
  "bearish",
  "loss",
  "losses",
  "decline",
  "declines",
  "down",
  "negative",
  "hack",
  "hacked",
  "lawsuit",
  "ban",
  "banned",
  "risk",
  "warning",
  "sell-off",
  "selloff",
  "liquidation",
];

const MAX_ARTICLES_PER_SOURCE = 20;
const MAX_TOTAL_ARTICLES = 30;

function stripCdata(value: string): string {
  return value
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "");
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ");
}

function cleanText(value: string): string {
  return decodeHtml(
    stripHtml(
      stripCdata(value),
    ),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function parseTag(
  block: string,
  tag: string,
): string {
  const match = block.match(
    new RegExp(
      `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
      "i",
    ),
  );

  return match?.[1]
    ? cleanText(match[1])
    : "";
}

function parseAtomLink(
  block: string,
): string {
  const match = block.match(
    /<link[^>]+href=["']([^"']+)["'][^>]*>/i,
  );

  return match?.[1] ?? "";
}

function parsePublishedAt(
  value: string,
): number {
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : Date.now();
}

function parseRSS(
  xml: string,
): RSSArticle[] {
  const items = xml.match(
    /<item\b[\s\S]*?<\/item>/gi,
  ) ?? [];

  return items
    .slice(0, MAX_ARTICLES_PER_SOURCE)
    .map((item) => {
      const title =
        parseTag(item, "title");

      const description =
        parseTag(item, "description");

      const url =
        parseTag(item, "link") ||
        parseAtomLink(item);

      const publishedRaw =
        parseTag(item, "pubDate") ||
        parseTag(item, "published") ||
        parseTag(item, "updated");

      return {
        title,
        summary: description,
        url,
        publishedAt:
          parsePublishedAt(
            publishedRaw,
          ),
      };
    })
    .filter(
      (article) =>
        article.title.length > 0 &&
        article.url.length > 0,
    );
}

function classifySentiment(
  title: string,
  summary: string,
): NewsItem["sentiment"] {
  const titleText = title.toLowerCase();
  const summaryText = summary.toLowerCase();

  const strongPositiveTitleWords = [
    "surge",
    "surges",
    "rally",
    "rallies",
    "spike",
    "spikes",
    "soar",
    "soars",
    "jump",
    "jumps",
    "breakout",
    "record high",
    "approval",
    "approved",
    "inflow",
    "inflows",
    "recovery",
    "recover",
  ];

  const strongNegativeTitleWords = [
    "outflow",
    "outflows",
    "withdrawal",
    "withdrawals",
    "liquidation",
    "liquidations",
    "hack",
    "hacked",
    "crash",
    "crashes",
    "lawsuit",
    "fraud",
    "sell-off",
    "selloff",
    "wary",
    "warning",
    "warnings",
    "ransom",
    "collapse",
    "collapsed",
  ];

  const positiveWords = [
    "bullish",
    "gain",
    "gains",
    "growth",
    "adoption",
    "increase",
    "increased",
    "strong",
    "recovery",
    "buying pressure",
    "institutional buying",
  ];

  const negativeWords = [
    "bearish",
    "loss",
    "losses",
    "decline",
    "declines",
    "drop",
    "drops",
    "fall",
    "falls",
    "falling",
    "down",
    "negative",
    "risk",
    "warning",
    "warns",
    "sell",
    "selling pressure",
    "outflow",
    "outflows",
    "withdrawal",
    "withdrawals",
    "liquidation",
    "liquidations",
    "hack",
    "hacked",
    "lawsuit",
    "fraud",
    "ban",
    "banned",
    "collapse",
    "collapsed",
  ];

  const strongPositiveTitleScore =
    strongPositiveTitleWords.reduce(
      (score, word) =>
        score + (titleText.includes(word) ? 10 : 0),
      0,
    );

  const strongNegativeTitleScore =
    strongNegativeTitleWords.reduce(
      (score, word) =>
        score + (titleText.includes(word) ? 10 : 0),
      0,
    );

  if (
    strongNegativeTitleScore >
    strongPositiveTitleScore
  ) {
    return "NEGATIVE";
  }

  if (
    strongPositiveTitleScore >
    strongNegativeTitleScore
  ) {
    return "POSITIVE";
  }

  const positiveScore =
    positiveWords.reduce(
      (score, word) =>
        score +
        (titleText.includes(word) ? 3 : 0) +
        (summaryText.includes(word) ? 1 : 0),
      0,
    );

  const negativeScore =
    negativeWords.reduce(
      (score, word) =>
        score +
        (titleText.includes(word) ? 3 : 0) +
        (summaryText.includes(word) ? 1 : 0),
      0,
    );

  if (negativeScore > positiveScore) {
    return "NEGATIVE";
  }

  if (positiveScore > negativeScore) {
    return "POSITIVE";
  }

  return "NEUTRAL";
}

function matchesSymbol(
  article: RSSArticle,
  symbol: string,
): boolean {
  const keywords =
    SYMBOL_KEYWORDS[
      symbol.toUpperCase()
    ];

  if (!keywords) {
    return true;
  }

  const text =
    `${article.title} ${article.summary}`
      .toLowerCase();

  return keywords.some(
    (keyword) =>
      text.includes(
        keyword.toLowerCase(),
      ),
  );
}

async function fetchFeed(
  url: string,
): Promise<string> {
  const response = await fetch(
    url,
    {
      method: "GET",
      headers: {
        accept:
          "application/rss+xml, application/xml, text/xml",
        "user-agent":
          "APLIFIX-Trader-AI/1.0",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `RSS feed returned ${response.status}`,
    );
  }

  return await response.text();
}

export class RSSNewsProvider
  implements NewsProvider {
  name = "Crypto RSS";

  async getNews(
    symbol: string,
  ): Promise<NewsItem[]> {
    const normalizedSymbol =
      symbol.toUpperCase();

    const results =
      await Promise.allSettled(
        SOURCE_FEEDS.map(
          async (source) => {
            const xml =
              await fetchFeed(
                source.url,
              );

            const articles =
              parseRSS(xml);

            return articles.map(
              (article) => ({
                ...article,
                source:
                  source.name,
              }),
            );
          },
        ),
      );

    const articles: Array<
      RSSArticle & {
        source: string;
      }
    > = [];

    for (
      const result of results
    ) {
      if (
        result.status ===
        "fulfilled"
      ) {
        articles.push(
          ...result.value,
        );
      } else {
        console.error(
          "[RSS NEWS] Feed failed",
          result.reason,
        );
      }
    }

    const filtered =
      articles.filter(
        (article) =>
          matchesSymbol(
            article,
            normalizedSymbol,
          ),
      );

    const unique =
      new Map<
        string,
        RSSArticle & {
          source: string;
        }
      >();

    for (
      const article of filtered
    ) {
      const key =
        article.url ||
        article.title;

      if (!unique.has(key)) {
        unique.set(
          key,
          article,
        );
      }
    }

    return Array.from(
      unique.values(),
    )
      .sort(
        (a, b) =>
          b.publishedAt -
          a.publishedAt,
      )
      .slice(
        0,
        MAX_TOTAL_ARTICLES,
      )
      .map(
        (article) => ({
          id:
            `${article.source}-${article.publishedAt}-${article.url}`,
          title:
            article.title,
          summary:
            article.summary,
          source:
            article.source,
          url:
            article.url,
          publishedAt:
            article.publishedAt,
          sentiment:
            classifySentiment(
              article.title,
              article.summary,
            ),
        }),
      );
  }
}

export const rssNewsProvider =
  new RSSNewsProvider();
