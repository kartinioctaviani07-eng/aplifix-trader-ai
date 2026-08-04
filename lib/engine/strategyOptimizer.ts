export interface StrategyInput {

  confidence: number;

  riskScore: number;

  patternStrength: number;

  learningScore: number;

  marketTrend:
    | "BULLISH"
    | "BEARISH"
    | "SIDEWAYS";

}

export interface StrategyResult {

  strategy:
    | "AGGRESSIVE"
    | "BALANCED"
    | "CONSERVATIVE";

  lotMultiplier: number;

  confidenceBoost: number;

  reasons: string[];

}

export function optimizeStrategy(

  input: StrategyInput

): StrategyResult {

  const reasons: string[] = [];

  let score = 0;

  score += input.confidence * 0.35;

  score += input.riskScore * 0.25;

  score += input.patternStrength * 0.25;

  score += input.learningScore * 0.15;

  if (

    input.marketTrend === "BULLISH"

  ) {

    score += 5;

    reasons.push(

      "Bullish market"

    );

  }

  if (

    input.marketTrend === "BEARISH"

  ) {

    score -= 5;

    reasons.push(

      "Bearish market"

    );

  }

  if (

    input.marketTrend === "SIDEWAYS"

  ) {

    reasons.push(

      "Sideways market"

    );

  }

  if (

    score >= 85

  ) {

    reasons.push(

      "High probability setup"

    );

    return {

      strategy: "AGGRESSIVE",

      lotMultiplier: 1.5,

      confidenceBoost: 10,

      reasons,

    };

  }

  if (

    score >= 65

  ) {

    reasons.push(

      "Balanced setup"

    );

    return {

      strategy: "BALANCED",

      lotMultiplier: 1,

      confidenceBoost: 5,

      reasons,

    };

  }

  reasons.push(

    "Capital protection"

  );

  return {

    strategy: "CONSERVATIVE",

    lotMultiplier: 0.5,

    confidenceBoost: 0,

    reasons,

  };

}
