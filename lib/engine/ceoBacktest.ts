import {
  Candle,
} from "@/lib/core/market/CandleProvider";

import {
  calculateIndicators,
} from "./indicatorEngine";

import {
  calculateMarketScore,
} from "./marketScoreEngine";

import {
  analyzeMultiTimeframe,
} from "./multiTimeframeEngine";

import {
  buildConsensus,
} from "./consensusEngine";

import {
  makeDecision,
} from "./decisionEngine";

export type BacktestTrade = {
  entryPrice: number;
  exitPrice: number;
  profit: number;
  profitPercent: number;
  result:
    | "PROFIT"
    | "LOSS"
    | "BREAK EVEN";
};

export type CEOBacktestResult = {
  initialBalance: number;
  finalBalance: number;
  totalProfit: number;
  totalTrades: number;
  win: number;
  loss: number;
  breakEven: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
};

export function runCEOBacktest(
  candles: Candle[],
  initialBalance = 10_000_000
): CEOBacktestResult {

  let balance =
    initialBalance;

  let peakBalance =
    initialBalance;

  let maxDrawdown = 0;

  const trades: BacktestTrade[] = [];

  let openTrade:
    | {
        entryPrice: number;
        stopLoss: number;
        takeProfit: number;
        quantity: number;
      }
    | null = null;

  for (
    let index = 50;
    index < candles.length;
    index++
  ) {

    const history =
      candles.slice(
        0,
        index + 1
      );

    const current =
      candles[index];

    if (openTrade) {

      const hitStop =
        current.low <=
        openTrade.stopLoss;

      const hitTarget =
        current.high >=
        openTrade.takeProfit;

      if (
        hitStop ||
        hitTarget
      ) {

        const exitPrice =
          hitStop
            ? openTrade.stopLoss
            : openTrade.takeProfit;

        const profit =
          (
            exitPrice -
            openTrade.entryPrice
          ) *
          openTrade.quantity;

        const profitPercent =
          (
            profit /
            (
              openTrade.entryPrice *
              openTrade.quantity
            )
          ) *
          100;

        balance +=
          profit;

        trades.push({
          entryPrice:
            openTrade.entryPrice,

          exitPrice,

          profit:
            Number(
              profit.toFixed(2)
            ),

          profitPercent:
            Number(
              profitPercent.toFixed(2)
            ),

          result:
            profit > 0
              ? "PROFIT"
              : profit < 0
                ? "LOSS"
                : "BREAK EVEN",
        });

        openTrade = null;

        peakBalance =
          Math.max(
            peakBalance,
            balance
          );

        const drawdown =
          peakBalance > 0
            ? (
                (
                  peakBalance -
                  balance
                ) /
                peakBalance
              ) *
              100
            : 0;

        maxDrawdown =
          Math.max(
            maxDrawdown,
            drawdown
          );

        continue;
      }
    }

    if (openTrade) {
      continue;
    }

    const technical =
      calculateIndicators(
        history
      );

    const marketScore =
      calculateMarketScore({
        trend:
          technical.trend,

        rsi:
          technical.rsi,

        macd:
          technical.macd,

        signal:
          technical.signal,

        adx:
          technical.adx,

        patternStrength:
          technical.trendStrength,
      });

    const multiTimeframe =
      analyzeMultiTimeframe(
        history
      );

    const consensus =
      buildConsensus(
        multiTimeframe
      );

    const technicalScore =
      Math.round(
        (
          marketScore.technicalScore +
          consensus.score
        ) / 2
      );

    const decision =
      makeDecision({
        technicalScore,

        newsScore:
          50,

        fundamentalScore:
          50,

        macroScore:
          50,

        sentimentScore:
          50,

        riskScore:
          100,

        learningScore:
          50,
      });

    if (
      decision.action !== "BUY" ||
      decision.confidence < 75
    ) {
      continue;
    }

    const stopLossPercent =
      2;

    const riskCapital =
      balance *
      0.01;

    const stopDistance =
      current.close *
      (
        stopLossPercent /
        100
      );

    if (
      stopDistance <= 0
    ) {
      continue;
    }

    const quantity =
      riskCapital /
      stopDistance;

    openTrade = {
      entryPrice:
        current.close,

      stopLoss:
        current.close *
        0.98,

      takeProfit:
        current.close *
        1.04,

      quantity,
    };
  }

  const totalProfit =
    balance -
    initialBalance;

  const win =
    trades.filter(
      (trade) =>
        trade.result === "PROFIT"
    ).length;

  const loss =
    trades.filter(
      (trade) =>
        trade.result === "LOSS"
    ).length;

  const breakEven =
    trades.filter(
      (trade) =>
        trade.result === "BREAK EVEN"
    ).length;

  const grossProfit =
    trades
      .filter(
        (trade) =>
          trade.profit > 0
      )
      .reduce(
        (sum, trade) =>
          sum + trade.profit,
        0
      );

  const grossLoss =
    Math.abs(
      trades
        .filter(
          (trade) =>
            trade.profit < 0
        )
        .reduce(
          (sum, trade) =>
            sum + trade.profit,
          0
        )
    );

  const profitFactor =
    grossLoss > 0
      ? grossProfit /
        grossLoss
      : grossProfit > 0
        ? Infinity
        : 0;

  const winRate =
    trades.length > 0
      ? (
          win /
          trades.length
        ) *
        100
      : 0;

  return {
    initialBalance,

    finalBalance:
      Number(
        balance.toFixed(2)
      ),

    totalProfit:
      Number(
        totalProfit.toFixed(2)
      ),

    totalTrades:
      trades.length,

    win,

    loss,

    breakEven,

    winRate:
      Number(
        winRate.toFixed(2)
      ),

    profitFactor:
      Number.isFinite(
        profitFactor
      )
        ? Number(
            profitFactor.toFixed(2)
          )
        : Infinity,

    maxDrawdown:
      Number(
        maxDrawdown.toFixed(2)
      ),

    trades,
  };
}
