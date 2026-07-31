export type RiskInput = {
  volatility: number;
  stopLossPercent: number;
  positionSizePercent: number;
};

export type RiskResult = {
  riskScore: number;
  level:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
  reasons: string[];
};


export function calculateRisk(
  input: RiskInput
): RiskResult {

  let score = 100;

  const reasons: string[] = [];


  if (input.volatility > 5) {
    score -= 25;

    reasons.push(
      "Volatilitas market tinggi."
    );
  }


  if (input.stopLossPercent < 2) {
    score -= 20;

    reasons.push(
      "Stop loss terlalu dekat."
    );
  }


  if (input.positionSizePercent > 10) {
    score -= 30;

    reasons.push(
      "Ukuran posisi terlalu besar."
    );
  }


  score = Math.max(
    0,
    Math.min(
      100,
      score
    )
  );


  let level:
    | "LOW"
    | "MEDIUM"
    | "HIGH";


  if (score >= 70) {
    level = "LOW";
  } else if (score >= 40) {
    level = "MEDIUM";
  } else {
    level = "HIGH";
  }


  return {
    riskScore: score,
    level,
    reasons,
  };

}
