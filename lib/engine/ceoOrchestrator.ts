import {
  candleHub,
} from "@/lib/core/market/CandleHub";

import "@/lib/core/market/candleIndex";

import {
  aiBrain,
} from "./aiBrain";

import {
  executeTrade,
} from "./tradeExecutor";

import {
  positionManager,
} from "./PositionManager";

import {
  monitorPositions,
} from "./positionMonitor";

import {
  ceoAccount,
} from "./ceoAccount";

export type CEOAction =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "WAIT";

export type CEOResult = {
  symbol: string;
  action: CEOAction;
  confidence: number;
  price: number;
  riskLevel: string;

  macro: {
    score: number;
    inflation: number | null;
    unemployment: number | null;
    gdpGrowth: number | null;
    provider: string;
  };

  position: ReturnType<
    typeof positionManager.getPosition
  >;

  executed: boolean;
  message: string;

  account: ReturnType<
    typeof ceoAccount.getSnapshot
  >;

  timestamp: number;
};

export async function runCEO(
  symbol: string
): Promise<CEOResult> {
  const candles =
    await candleHub.getCandles(
      symbol,
      "1h"
    );

  const lastCandle =
    candles.at(-1);

  if (!lastCandle) {
    throw new Error(
      `Tidak ada candle untuk ${symbol}`
    );
  }

  const price =
    lastCandle.close;

  const monitor =
    monitorPositions({
      symbol,
      price,
      high: lastCandle.high,
      low: lastCandle.low,
    });

  const brain =
    await aiBrain.think(
      symbol,
      candles
    );

  const technicalScore =
    Math.round(
      brain.marketScore.technicalScore * 0.30 +
      brain.multiTimeframe.averageScore * 0.70
    );

  console.log(
    "=== CEO MTF DIAGNOSTIC ===",
    JSON.stringify(
      {
        symbol,

        marketScore: {
          technicalScore:
            brain.marketScore.technicalScore,
          reasons:
            brain.marketScore.reasons,
        },

        multiTimeframe: {
          overallTrend:
            brain.multiTimeframe.overallTrend,
          averageScore:
            brain.multiTimeframe.averageScore,
          confidence:
            brain.multiTimeframe.confidence,
          analyses:
            brain.multiTimeframe.analyses,
        },

        consensus: {
          action:
            brain.consensus.action,
          score:
            brain.consensus.score,
          confidence:
            brain.consensus.confidence,
          bullishVotes:
            brain.consensus.bullishVotes,
          bearishVotes:
            brain.consensus.bearishVotes,
          reason:
            brain.consensus.reason,
        },

        macro: {
          score:
            brain.macro.score,
          inflation:
            brain.macro.inflation,
          unemployment:
            brain.macro.unemployment,
          gdpGrowth:
            brain.macro.gdpGrowth,
          provider:
            brain.macro.provider,
          reasons:
            brain.macro.reasons,
        },

        decision: {
          action:
            brain.decision.action,
          technicalScore,
          totalScore:
            brain.decision.totalScore,
          confidence:
            brain.decision.confidence,
          reason:
            brain.decision.reason,
        },

        risk: {
          level:
            brain.risk.level,
          score:
            brain.risk.riskScore,
          reasons:
            brain.risk.reasons,
        },
      },
      null,
      2
    )
  );

  const action =
    brain.decision.action;

  const confidence =
    brain.decision.confidence;

  const existing =
    positionManager.getPosition(
      symbol
    );

  const macro = {
    score:
      brain.macro.score,

    inflation:
      brain.macro.inflation,

    unemployment:
      brain.macro.unemployment,

    gdpGrowth:
      brain.macro.gdpGrowth,

    provider:
      brain.macro.provider,
  };

  if (existing) {
    return {
      symbol,
      action,
      confidence,
      price,
      riskLevel:
        brain.risk.level,
      macro,
      position:
        existing,
      executed:
        monitor.closed.length > 0,
      message:
        monitor.closed.length > 0
          ? `Posisi ditutup: ${monitor.closed[0].reason}`
          : "Posisi masih terbuka.",
      account:
        ceoAccount.getSnapshot(),
      timestamp:
        Date.now(),
    };
  }

  if (
    action === "BUY" &&
    confidence >= 75 &&
    brain.risk.level === "LOW"
  ) {
    const position =
      await executeTrade(
        symbol,
        "BUY",
        brain.decision.id
      );

    if (position) {
      return {
        symbol,
        action,
        confidence,
        price,
        riskLevel:
          brain.risk.level,
        macro,
        position,
        executed: true,
        message:
          "CEO membuka posisi BUY.",
        account:
          ceoAccount.getSnapshot(),
        timestamp:
          Date.now(),
      };
    }

    return {
      symbol,
      action,
      confidence,
      price,
      riskLevel:
        brain.risk.level,
      macro,
      position: null,
      executed: false,
      message:
        "Sinyal BUY ada, tetapi posisi tidak dapat dibuka.",
      account:
        ceoAccount.getSnapshot(),
      timestamp:
        Date.now(),
    };
  }

  return {
    symbol,
    action,
    confidence,
    price,
    riskLevel:
      brain.risk.level,
    macro,
    position: null,
    executed: false,
    message:
      action === "BUY"
        ? "BUY ditahan karena confidence atau risk belum memenuhi syarat."
        : `CEO memilih ${action}.`,
    account:
      ceoAccount.getSnapshot(),
    timestamp:
      Date.now(),
  };
}
