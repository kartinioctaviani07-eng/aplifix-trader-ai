import {
  MultiTimeframeResult,
} from "./multiTimeframeEngine";

export interface ConsensusResult {

  action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";

  confidence: number;

  bullishVotes: number;

  bearishVotes: number;

  score: number;

  reason: string[];

}

export function buildConsensus(
  result: MultiTimeframeResult
): ConsensusResult {

  const bullishVotes =
    result.analyses.filter(

      (item) =>
        item.trend === "Bullish"

    ).length;

  const bearishVotes =
    result.analyses.length -
    bullishVotes;

  const reason: string[] = [];

  reason.push(
    `${bullishVotes} Bullish timeframe`
  );

  reason.push(
    `${bearishVotes} Bearish timeframe`
  );

  reason.push(
    `Average Score ${result.averageScore}`
  );

  reason.push(
    `Average Confidence ${result.confidence}`
  );

  let action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";

  if (

    bullishVotes >= 4 &&
    result.averageScore >= 75

  ) {

    action = "BUY";

    reason.push(
      "Mayoritas timeframe bullish."
    );

  }

  else if (

    bearishVotes >= 4 &&
    result.averageScore <= 35

  ) {

    action = "SELL";

    reason.push(
      "Mayoritas timeframe bearish."
    );

  }

  else if (

    result.averageScore >= 60

  ) {

    action = "HOLD";

    reason.push(
      "Trend cukup baik namun belum dominan."
    );

  }

  else {

    action = "WAIT";

    reason.push(
      "Belum ada konsensus kuat."
    );

  }

  return {

    action,

    confidence:
      result.confidence,

    bullishVotes,

    bearishVotes,

    score:
      result.averageScore,

    reason,

  };

}
