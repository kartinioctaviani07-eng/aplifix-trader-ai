import { NextResponse } from "next/server";

import { ceoAccount } from "@/lib/engine/ceoAccount";
import { positionManager } from "@/lib/engine/PositionManager";

const MAX_RISK_PERCENT = 1;
const MAX_EXPOSURE_PERCENT = 50;
const MIN_STOP_LOSS_PERCENT = 2;
const MIN_RISK_REWARD = 2;

export async function GET() {
  const account = await ceoAccount.getSnapshot();

  const openPositions =
    await positionManager.getOpenPositions();

  const exposureAmount = openPositions.reduce(
    (total, position) =>
      total +
      position.entryPrice * position.quantity,
    0
  );

  const exposurePercent =
    account.equity > 0
      ? (exposureAmount / account.equity) * 100
      : 0;

  const totalRiskAmount = openPositions.reduce(
    (total, position) =>
      total +
      Math.abs(
        position.entryPrice - position.stopLoss
      ) * position.quantity,
    0
  );

  const riskPercent =
    account.equity > 0
      ? (totalRiskAmount / account.equity) * 100
      : 0;

  const protectionStatus =
    riskPercent <= MAX_RISK_PERCENT &&
    exposurePercent <= MAX_EXPOSURE_PERCENT
      ? "PROTECTED"
      : "WARNING";

  return NextResponse.json({
    success: true,

    account: {
      initialBalance: account.initialBalance,
      balance: account.balance,
      equity: account.equity,
      realizedProfit: account.realizedProfit,
      unrealizedProfit: account.unrealizedProfit,
    },

    policy: {
      maxRiskPercent: MAX_RISK_PERCENT,
      maxExposurePercent: MAX_EXPOSURE_PERCENT,
      minStopLossPercent: MIN_STOP_LOSS_PERCENT,
      minRiskReward: MIN_RISK_REWARD,
    },

    portfolio: {
      openPositions: openPositions.length,

      exposureAmount: Number(
        exposureAmount.toFixed(2)
      ),

      exposurePercent: Number(
        exposurePercent.toFixed(2)
      ),

      riskAmount: Number(
        totalRiskAmount.toFixed(2)
      ),

      riskPercent: Number(
        riskPercent.toFixed(2)
      ),
    },

    engine: {
      status: "OPERATIONAL",
      protectionStatus,
      vetoEnabled: true,
    },

    positions: openPositions.map(
      (position) => ({
        id: position.id,
        symbol: position.symbol,
        side: position.side,
        entryPrice: position.entryPrice,
        quantity: position.quantity,
        stopLoss: position.stopLoss,
        takeProfit: position.takeProfit,
        decisionId: position.decisionId,
        openedAt: position.openedAt,
      })
    ),

    timestamp: Date.now(),
  });
}
