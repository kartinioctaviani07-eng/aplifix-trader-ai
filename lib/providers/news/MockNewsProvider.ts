import {
  NewsItem,
  NewsProvider,
} from "./NewsProvider";

export class MockNewsProvider
  implements NewsProvider {

  name =
    "Mock News Provider";

  async getNews(
    symbol: string
  ): Promise<NewsItem[]> {

    return [

      {
        id: crypto.randomUUID(),

        title:
          `${symbol} mendapat sentimen positif`,

        summary:
          "AI mendeteksi berita positif terhadap aset.",

        source:
          "APLIFIX AI",

        url:
          "#",

        publishedAt:
          Date.now(),

        sentiment:
          "POSITIVE",

      },

      {
        id: crypto.randomUUID(),

        title:
          `${symbol} stabil di area support`,

        summary:
          "Tidak ada perubahan signifikan.",

        source:
          "APLIFIX AI",

        url:
          "#",

        publishedAt:
          Date.now(),

        sentiment:
          "NEUTRAL",

      },

      {
        id: crypto.randomUUID(),

        title:
          `${symbol} mengalami tekanan jual`,

        summary:
          "Beberapa investor melakukan profit taking.",

        source:
          "APLIFIX AI",

        url:
          "#",

        publishedAt:
          Date.now(),

        sentiment:
          "NEGATIVE",

      },

    ];

  }

}

export const mockNewsProvider =
  new MockNewsProvider();
