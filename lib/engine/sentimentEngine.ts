import {
  NewsItem,
} from "@/lib/providers/news/NewsProvider";


export type SentimentResult = {

  score: number;

  positive: number;

  negative: number;

  neutral: number;

};


export function analyzeSentiment(
  news: NewsItem[]
): SentimentResult {


  let positive = 0;
  let negative = 0;
  let neutral = 0;


  for (
    const item of news
  ) {

    if (
      item.sentiment === "POSITIVE"
    ) {
      positive++;
    }

    else if (
      item.sentiment === "NEGATIVE"
    ) {
      negative++;
    }

    else {
      neutral++;
    }

  }


  const total =
    news.length || 1;


  const score =
    Math.round(
      (
        positive * 100 +
        neutral * 50 +
        negative * 0
      )
      /
      total
    );


  return {

    score,

    positive,

    negative,

    neutral,

  };

}
