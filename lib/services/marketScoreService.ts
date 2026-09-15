import { analyzeFundamental } from "@/lib/engine/fundamentalEngine";
import { analyzeSentiment } from "@/lib/engine/sentimentEngine";
import { coinGeckoFundamentalProvider } from "@/lib/providers/fundamental/CoinGeckoFundamentalProvider";
import { newsService } from "./newsService";

export type MarketScores = {
  newsScore: number;
  sentimentScore: number;
  fundamentalScore: number;
  macroScore: number;
  newsProvider: string | null;
  totalNews: number;
  fundamentalReasons: string[];
  fundamentalMarketCap: number;
  fundamentalVolume24h: number;
  fundamentalPriceChange24h: number;
  fundamentalMarketCapRank: number | null;
};

class MarketScoreService {
  async getScores(symbol: string): Promise<MarketScores> {
    const [news, fundamentalMarketData] = await Promise.all([
      newsService.getNews(symbol),
      coinGeckoFundamentalProvider.getMarketData(symbol),
    ]);

    const sentiment = analyzeSentiment(news);
    const fundamental = analyzeFundamental(fundamentalMarketData);

    return {
      newsScore: sentiment.score,
      sentimentScore: sentiment.score,
      fundamentalScore: fundamental.score,
      macroScore: 50,
      newsProvider: newsService.getProvider(),
      totalNews: news.length,
      fundamentalReasons: fundamental.reasons,
      fundamentalMarketCap: fundamental.marketCap,
      fundamentalVolume24h: fundamental.volume24h,
      fundamentalPriceChange24h: fundamental.priceChange24h,
      fundamentalMarketCapRank: fundamental.marketCapRank,
    };
  }
}

export const marketScoreService = new MarketScoreService();
