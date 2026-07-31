import "@/lib/providers/news";

import { newsHub } from "@/lib/providers/news";

export class NewsService {

  async getNews(
    symbol: string
  ) {
    return await newsHub.getNews(
      symbol
    );
  }

  getProvider() {
    return newsHub.getLastProvider();
  }

}

export const newsService =
  new NewsService();
