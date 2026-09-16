import { Candle } from "@/lib/core/market/CandleProvider";

import { ceoAccount } from "./ceoAccount";

import { positionManager } from "./PositionManager";

export type RiskManagerInput = {
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  candles: Candle[];
};

export type RiskManagerResult = {
  approved: boolean;
  level: "LOW" | "MEDIUM" | "HIGH";
  riskScore: number;
  riskPercent: number;
  riskAmount: number;
  exposurePercent: number;
  exposureAmount: number;
  stopLossPercent: number;
  riskRewardRatio: number;
  volatilityPercent: number;
  reasons: string[];
  rejections: string[];
};

const MAX_RISK_PERCENT = 1;
const MIN_STOP_LOSS_PERCENT = 2;
const MIN_RISK_REWARD = 2;
const MAX_EXPOSURE_PERCENT = 50;
const MAX_VOLATILITY_PERCENT = 5;
const VOLATILITY_LOOKBACK = 20;

function calculateVolatility(
  candles: Candle[]
): number {
  const recent = candles.slice(
    -VOLATILITY_LOOKBACK
  );

  if (recent.length === 0) {
    return 0;
  }

  const totalRangePercent =
    recent.reduce(
      (total, candle) => {
        if (candle.close <= 0) {
          return total;
        }

        const range =
          ((candle.high - candle.low) /
            candle.close) *
          100;

        return total + range;
      },
      0
    );

  return Number(
    (
      totalRangePercent /
      recent.length
    ).toFixed(2)
  );
}

function calculateRiskReward(
  side: "BUY" | "SELL",
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number {
  const riskDistance =
    Math.abs(
      entryPrice - stopLoss
    );

  const rewardDistance =
    Math.abs(
      takeProfit - entryPrice
    );

  if (
    riskDistance <= 0 ||
    rewardDistance <= 0
  ) {
    return 0;
  }

  return Number(
    (
      rewardDistance /
      riskDistance
    ).toFixed(2)
  );
}

export async function evaluateRisk(
  input: RiskManagerInput
): Promise<RiskManagerResult> {
  const reasons: string[] = [];
  const rejections: string[] = [];

  const balance =
    await ceoAccount.getBalance();

  const equity =
    await ceoAccount.getEquity();

  if (
    balance <= 0 ||
    equity <= 0
  ) {
    rejections.push(
      "Account equity tidak mencukupi."
    );
  }

  const hasOpenPosition =
    await positionManager.hasOpenPosition(
      input.symbol
    );

  if (hasOpenPosition) {
    rejections.push(
      `Posisi ${input.symbol} sudah terbuka.`
    );
  }

  if (
    input.entryPrice <= 0 ||
    input.stopLoss <= 0 ||
    input.takeProfit <= 0 ||
    input.quantity <= 0
  ) {
    rejections.push(
      "Parameter perdagangan tidak valid."
    );
  }

  const riskAmount =
    Math.abs(
      input.entryPrice -
        input.stopLoss
    ) *
    input.quantity;

  const exposureAmount =
    input.entryPrice *
    input.quantity;

  const riskPercent =
    equity > 0
      ? (riskAmount / equity) *
        100
      : 100;

  const exposurePercent =
    equity > 0
      ? (exposureAmount / equity) *
        100
      : 100;

  const stopLossPercent =
    input.entryPrice > 0
      ? (Math.abs(
          input.entryPrice -
            input.stopLoss
        ) /
          input.entryPrice) *
        100
      : 0;

  const riskRewardRatio =
    calculateRiskReward(
      input.side,
      input.entryPrice,
      input.stopLoss,
      input.takeProfit
    );

  const volatilityPercent =
    calculateVolatility(
      input.candles
    );

  if (
    riskPercent >
    MAX_RISK_PERCENT
  ) {
    rejections.push(
      `Risk per trade ${riskPercent.toFixed(
        2
      )}% melebihi batas ${MAX_RISK_PERCENT}%.`
    );
  } else {
    reasons.push(
      `Risk per trade ${riskPercent.toFixed(
        2
      )}% masih dalam batas.`
    );
  }

  if (
    stopLossPercent <
    MIN_STOP_LOSS_PERCENT
  ) {
    rejections.push(
      `Stop loss ${stopLossPercent.toFixed(
        2
      )}% terlalu dekat. Minimum ${MIN_STOP_LOSS_PERCENT}%.`
    );
  } else {
    reasons.push(
      `Stop loss ${stopLossPercent.toFixed(
        2
      )}% memenuhi batas minimum.`
    );
  }

  if (
    riskRewardRatio <
    MIN_RISK_REWARD
  ) {
    rejections.push(
      `Risk/Reward 1:${riskRewardRatio.toFixed(
        2
      )} di bawah minimum 1:${MIN_RISK_REWARD}.`
    );
  } else {
    reasons.push(
      `Risk/Reward 1:${riskRewardRatio.toFixed(
        2
      )} memenuhi syarat.`
    );
  }

  if (
    exposurePercent >
    MAX_EXPOSURE_PERCENT
  ) {
    rejections.push(
      `Exposure ${exposurePercent.toFixed(
        2
      )}% melebihi batas ${MAX_EXPOSURE_PERCENT}%.`
    );
  } else {
    reasons.push(
      `Exposure ${exposurePercent.toFixed(
        2
      )}% masih dalam batas.`
    );
  }

  if (
    volatilityPercent >
    MAX_VOLATILITY_PERCENT
  ) {
    rejections.push(
      `Volatilitas ${volatilityPercent.toFixed(
        2
      )}% terlalu tinggi.`
    );
  } else {
    reasons.push(
      `Volatilitas ${volatilityPercent.toFixed(
        2
      )}% masih dapat diterima.`
    );
  }

  let riskScore = 100;

  if (
    riskPercent >
    MAX_RISK_PERCENT
  ) {
    riskScore -= 35;
  }

  if (
    stopLossPercent <
    MIN_STOP_LOSS_PERCENT
  ) {
    riskScore -= 20;
  }

  if (
    riskRewardRatio <
    MIN_RISK_REWARD
  ) {
    riskScore -= 20;
  }

  if (
    exposurePercent >
    MAX_EXPOSURE_PERCENT
  ) {
    riskScore -= 15;
  }

  if (
    volatilityPercent >
    MAX_VOLATILITY_PERCENT
  ) {
    riskScore -= 20;
  }

  riskScore = Math.max(
    0,
    Math.min(100, riskScore)
  );

  let level:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  if (riskScore >= 70) {
    level = "LOW";
  } else if (riskScore >= 40) {
    level = "MEDIUM";
  } else {
    level = "HIGH";
  }

  const approved =
    rejections.length === 0;

  return {
    approved,
    level,
    riskScore,
    riskPercent: Number(
      riskPercent.toFixed(2)
    ),
    riskAmount: Number(
      riskAmount.toFixed(2)
    ),
    exposurePercent: Number(
      exposurePercent.toFixed(2)
    ),
    exposureAmount: Number(
      exposureAmount.toFixed(2)
    ),
    stopLossPercent: Number(
      stopLossPercent.toFixed(2)
    ),
    riskRewardRatio,
    volatilityPercent,
    reasons,
    rejections,
  };
}
