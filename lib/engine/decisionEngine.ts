export type DecisionInput = {
  technicalScore: number;
  newsScore: number;
  fundamentalScore: number;
  macroScore: number;
  sentimentScore: number;
  riskScore: number;
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

  const totalScore =
    Math.round(
      (
        input.technicalScore +
        input.newsScore +
        input.fundamentalScore +
        input.macroScore +
        input.sentimentScore +
        input.riskScore
      ) / 6
    );

  const reason: string[] = [];

  if (input.technicalScore >= 70) {
    reason.push(
      "Technical trend mendukung."
    );
  }

  if (input.newsScore >= 70) {
    reason.push(
      "Sentimen berita positif."
    );
  }

  if (input.fundamentalScore >= 70) {
    reason.push(
      "Fundamental aset kuat."
    );
  }

  if (input.macroScore < 50) {
    reason.push(
      "Kondisi ekonomi global perlu diperhatikan."
    );
  }

  if (input.riskScore < 50) {
    reason.push(
      "Risiko perdagangan cukup tinggi."
    );
  }

  let action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";

  if (totalScore >= 80) {
    action = "BUY";
  } else if (totalScore >= 65) {
    action = "HOLD";
  } else if (totalScore >= 50) {
    action = "WAIT";
  } else {
    action = "SELL";
  }

  return {
    action,
    confidence: totalScore,
    totalScore,
    reason,
  };

}
