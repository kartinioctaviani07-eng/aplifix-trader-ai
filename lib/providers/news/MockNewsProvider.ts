import {
  NewsProvider,
  NewsItem,
} from "./NewsProvider";

export class MockNewsProvider
  implements NewsProvider
{
  name = "Mock News";

  async getNews(
    symbol: string
  ): Promise<NewsItem[]> {

    return [
      {
        id: crypto.randomUUID(),
        title: `${symbol} mendapat sentimen positif`,
        summary:
          "Investor mulai kembali melakukan akumulasi.",
        source: "Mock News",
        url: "#",
        publishedAt: Date.now(),
        sentiment: "POSITIVE",
      },
      {
        id: crypto.randomUUID(),
        title: "Volatilitas pasar meningkat",
        summary:
          "Trader disarankan tetap menggunakan risk management.",
        source: "Mock News",
        url: "#",
        publishedAt: Date.now(),
        sentiment: "NEUTRAL",
      },
    ];

  }

}
