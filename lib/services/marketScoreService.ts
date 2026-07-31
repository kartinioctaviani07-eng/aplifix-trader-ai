import {
  newsService,
} from "./newsService";

import {
  analyzeSentiment,
} from "@/lib/engine/sentimentEngine";


export type MarketScores = {

  newsScore: number;

  sentimentScore: number;

  fundamentalScore: number;

  macroScore: number;

  newsProvider: string | null;

  totalNews: number;

};


class MarketScoreService {


  async getScores(
    symbol: string
  ): Promise<MarketScores> {


    const news =
      await newsService.getNews(
        symbol
      );


    const sentiment =
      analyzeSentiment(
        news
      );


    return {

      newsScore:
        sentiment.score,

      sentimentScore:
        sentiment.score,

      fundamentalScore:
        50,

      macroScore:
        50,

      newsProvider:
        newsService.getProvider(),

      totalNews:
        news.length,

    };

  }

}


export const marketScoreService =
  new MarketScoreService();
