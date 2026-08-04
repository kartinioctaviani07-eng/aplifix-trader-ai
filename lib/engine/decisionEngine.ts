import {
  adaptConfidence,
} from "./adaptiveConfidence";

export type DecisionInput = {
  technicalScore: number;
  newsScore: number;
  fundamentalScore: number;
  macroScore: number;
  sentimentScore: number;
  riskScore: number;
  learningScore?: number;
};

export type DecisionResult = {

  action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";

  confidence: number;

  totalScore: number;

  reason: string[];

};

export function makeDecision(
  input: DecisionInput
): DecisionResult {

  const weights = {

    technical: 0.40,

    news: 0.10,

    fundamental: 0.10,

    macro: 0.10,

    sentiment: 0.10,

    risk: 0.15,

    learning: 0.05,

  };

  const learningScore =
    input.learningScore ?? 50;

  const totalScore =
    Math.round(

      input.technicalScore *
        weights.technical +

      input.newsScore *
        weights.news +

      input.fundamentalScore *
        weights.fundamental +

      input.macroScore *
        weights.macro +

      input.sentimentScore *
        weights.sentiment +

      input.riskScore *
        weights.risk +

      learningScore *
        weights.learning

    );

  const reason: string[] = [];

  if (
    input.technicalScore >= 80
  ) {

    reason.push(
      "Technical trend bullish kuat."
    );

  }

  else if (
    input.technicalScore >= 60
  ) {

    reason.push(
      "Technical trend mulai mendukung."
    );

  }

  else if (
    input.technicalScore <= 30
  ) {

    reason.push(
      "Technical trend masih bearish."
    );

  }

  else {

    reason.push(
      "Technical belum memberikan konfirmasi."
    );

  }

  if (
    input.newsScore >= 70
  ) {

    reason.push(
      "News sentiment positif."
    );

  }

  if (
    input.newsScore <= 30
  ) {

    reason.push(
      "News sentiment negatif."
    );

  }

  if (
    input.riskScore >= 80
  ) {

    reason.push(
      "Risk management aman."
    );

  }

  if (
    input.riskScore < 50
  ) {

    reason.push(
      "Risiko perdagangan tinggi."
    );

  }

  if (
    learningScore >= 70
  ) {

    reason.push(
      "AI learning history mendukung keputusan."
    );

  }

  let action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";

  if (
    input.technicalScore >= 75 &&
    totalScore >= 75
  ) {

    action = "BUY";

  }

  else if (
    input.technicalScore <= 30 &&
    totalScore <= 40
  ) {

    action = "SELL";

  }

  else if (
    totalScore >= 60
  ) {

    action = "HOLD";

  }

  else {

    action = "WAIT";

  }

  const adaptive =
    adaptConfidence(
      totalScore
    );

  reason.push(
    `Adaptive bonus: +${adaptive.bonus.toFixed(1)}`
  );

  reason.push(
    `Adaptive penalty: -${adaptive.penalty.toFixed(1)}`
  );

  return {

    action,

    confidence:
      adaptive.adjustedConfidence,

    totalScore,

    reason,

  };

}
