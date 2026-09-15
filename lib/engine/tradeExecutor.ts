import { candleHub } from "@/lib/core/market/CandleHub";
import "@/lib/core/market/candleIndex";

import {
  positionManager,
  Position,
} from "./PositionManager";

import {
  ceoAccount,
} from "./ceoAccount";

import {
  aiMemory,
} from "./aiMemory";

import {
  evaluateRisk,
  RiskManagerResult,
} from "./riskManager";

export type TradeExecutionResult = {
  position: Position | null;
  risk: RiskManagerResult;
};

export async function executeTrade(
  symbol: string,
  action: "BUY" | "SELL",
  decisionId?: string
): Promise<Position | null> {
  if (
    positionManager.hasOpenPosition(
      symbol
    )
  ) {
    return null;
  }

  const candles =
    await candleHub.getCandles(
      symbol,
      "1h"
    );

  const lastCandle =
    candles.at(-1);

  if (!lastCandle) {
    return null;
  }

  const entryPrice =
    lastCandle.close;

  const stopLossPercent = 2;
  const riskPercent = 1;

  const quantity =
    ceoAccount.getPositionSize(
      entryPrice,
      stopLossPercent,
      riskPercent
    );

  if (quantity <= 0) {
    return null;
  }

  const stopLoss =
    action === "BUY"
      ? entryPrice * 0.98
      : entryPrice * 1.02;

  const takeProfit =
    action === "BUY"
      ? entryPrice * 1.04
      : entryPrice * 0.96;

  const risk =
    evaluateRisk({
      symbol,
      side: action,
      entryPrice,
      stopLoss,
      takeProfit,
      quantity,
      candles,
    });

  console.log(
    "=== RISK MANAGER ===",
    JSON.stringify(
      {
        symbol,
        action,
        approved: risk.approved,
        level: risk.level,
        riskScore: risk.riskScore,
        riskPercent: risk.riskPercent,
        exposurePercent:
          risk.exposurePercent,
        riskRewardRatio:
          risk.riskRewardRatio,
        volatilityPercent:
          risk.volatilityPercent,
        reasons: risk.reasons,
        rejections:
          risk.rejections,
      },
      null,
      2
    )
  );

  if (!risk.approved) {
    console.warn(
      `RISK MANAGER REJECTED ${action} ${symbol}:`,
      risk.rejections
    );

    return null;
  }

  const position: Position = {
    id: crypto.randomUUID(),
    symbol,
    side: action,
    entryPrice,
    currentPrice: entryPrice,
    quantity,
    stopLoss,
    takeProfit,
    openedAt: Date.now(),
    status: "OPEN",
    decisionId,
  };

  const opened =
    positionManager.openPosition(
      position
    );

  if (!opened) {
    return null;
  }

  if (decisionId) {
    aiMemory.updateResult(
      decisionId,
      {
        entryPrice:
          position.entryPrice,
        result: "OPEN",
      }
    );
  }

  console.log(
    `RISK MANAGER APPROVED ${action} ${symbol}`
  );

  return position;
}
