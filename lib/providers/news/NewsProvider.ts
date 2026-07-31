export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: number;
  sentiment:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";
};

export interface NewsProvider {
  name: string;

  getNews(
    symbol: string
  ): Promise<NewsItem[]>;
}
