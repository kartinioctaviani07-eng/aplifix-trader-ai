import {
  NewsProvider,
  NewsItem,
} from "./NewsProvider";

export class NewsHub {

  private providers: NewsProvider[] = [];

  private lastProvider:
    string | null = null;

  register(
    provider: NewsProvider
  ) {

    this.providers.push(provider);

  }

  async getNews(
    symbol: string
  ): Promise<NewsItem[]> {

    let lastError: unknown;

    for (
      const provider of this.providers
    ) {

      try {

        const news =
          await provider.getNews(
            symbol
          );

        this.lastProvider =
          provider.name;

        return news;

      } catch (error) {

        console.error(
          `${provider.name} news failed`,
          error
        );

        lastError = error;

      }

    }

    this.lastProvider = null;

    throw (
      lastError ??
      new Error(
        "All news providers failed"
      )
    );

  }

  getLastProvider() {

    return this.lastProvider;

  }

}

export const newsHub =
  new NewsHub();
