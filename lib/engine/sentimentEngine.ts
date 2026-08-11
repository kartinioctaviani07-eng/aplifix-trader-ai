import {
  NewsItem,
} from "@/lib/providers/news/NewsProvider";

export interface SentimentResult {

  score: number;

  positive: number;

  negative: number;

  neutral: number;

  dominant:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  confidence: number;

  reasons: string[];

}

export function analyzeSentiment(
  news: NewsItem[]
): SentimentResult {

  let positive = 0;

  let negative = 0;

  let neutral = 0;

  for (
    const item of news
  ) {

    switch (
      item.sentiment
    ) {

      case "POSITIVE":

        positive++;

        break;

      case "NEGATIVE":

        negative++;

        break;

      default:

        neutral++;

        break;

    }

  }

  const total =
    Math.max(
      1,
      news.length
    );

  const score =
    Math.round(

      (
        positive * 100 +

        neutral * 50

      ) / total

    );

  let dominant:
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

  if (
    positive >
    negative
  ) {

    dominant =
      "POSITIVE";

  }

  else if (
    negative >
    positive
  ) {

    dominant =
      "NEGATIVE";

  }

  else {

    dominant =
      "NEUTRAL";

  }

  const confidence =
    Math.round(

      Math.max(
        positive,
        negative,
        neutral
      )

      / total

      * 100

    );

  const reasons: string[] = [];

  if (
    dominant === "POSITIVE"
  ) {

    reasons.push(
      "Mayoritas berita positif."
    );

  }

  if (
    dominant === "NEGATIVE"
  ) {

    reasons.push(
      "Mayoritas berita negatif."
    );

  }

  if (
    dominant === "NEUTRAL"
  ) {

    reasons.push(
      "Sentimen pasar masih netral."
    );

  }

  return {

    score,

    positive,

    negative,

    neutral,

    dominant,

    confidence,

    reasons,

  };

}
