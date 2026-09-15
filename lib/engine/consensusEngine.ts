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

  const totalTimeframes =
    result.analyses.length;

  const bullishRatio =
    totalTimeframes > 0
      ? bullishVotes /
        totalTimeframes
      : 0;

  const bearishRatio =
    totalTimeframes > 0
      ? bearishVotes /
        totalTimeframes
      : 0;

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
    bullishRatio >= 0.8 &&
    result.averageScore >= 75
  ) {
    action = "BUY";

    reason.push(
      "Mayoritas kuat timeframe bullish."
    );
  } else if (
    bearishRatio >= 0.8 &&
    result.averageScore <= 35
  ) {
    action = "SELL";

    reason.push(
      "Mayoritas kuat timeframe bearish."
    );
  } else if (
    result.averageScore >= 60
  ) {
    action = "HOLD";

    reason.push(
      "Trend cukup baik namun belum dominan."
    );
  } else {
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
