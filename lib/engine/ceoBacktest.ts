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
  analyzeHistoricalMultiTimeframe,
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

export type BacktestDiagnostics = {
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  waitSignals: number;
  buyConfidenceBelow75: number;
  eligibleBuySignals: number;
  highestConfidence: number;
  highestTechnicalScore: number;
  highestConsensusScore: number;
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
  diagnostics: BacktestDiagnostics;
};

function clampScore(
  value: number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value)
    )
  );
}

function calculateRiskScore(
  atrPercent: number
): number {
  if (atrPercent < 1) {
    return 100;
  }

  if (atrPercent < 1.5) {
    return 90;
  }

  if (atrPercent < 2) {
    return 80;
  }

  if (atrPercent < 2.5) {
    return 70;
  }

  if (atrPercent < 4) {
    return 50;
  }

  return 30;
}

function calculateMarketProxyScores(
  technical: ReturnType<
    typeof calculateIndicators
  >,
  consensusScore: number
) {
  const trendScore =
    technical.trend === "Bullish"
      ? 100
      : 30;

  const rsiScore =
    technical.rsi >= 50 &&
    technical.rsi <= 70
      ? 100
      : technical.rsi > 70
        ? 60
        : technical.rsi >= 30
          ? 50
          : 20;

  const macdScore =
    technical.macd >=
    technical.signal
      ? 90
      : 30;

  const adxScore =
    technical.adx >= 25
      ? 90
      : technical.adx >= 20
        ? 70
        : 50;

  const strengthScore =
    clampScore(
      technical.trendStrength * 10
    );

  const momentumScore =
    clampScore(
      (
        trendScore +
        rsiScore +
        macdScore +
        strengthScore
      ) / 4
    );

  const newsScore =
    clampScore(
      (
        momentumScore +
        consensusScore
      ) / 2
    );

  const fundamentalScore =
    clampScore(
      (
        trendScore +
        strengthScore +
        adxScore
      ) / 3
    );

  const macroScore =
    clampScore(
      (
        adxScore +
        strengthScore +
        consensusScore
      ) / 3
    );

  const sentimentScore =
    clampScore(
      (
        rsiScore +
        momentumScore +
        consensusScore
      ) / 3
    );

  return {
    newsScore,
    fundamentalScore,
    macroScore,
    sentimentScore,
  };
}

export function runCEOBacktest(
  candles: Candle[],
  initialBalance = 10_000_000,
  evaluationCandles?: number
): CEOBacktestResult {
  let balance = initialBalance;
  let peakBalance = initialBalance;
  let maxDrawdown = 0;

  const trades: BacktestTrade[] = [];

  const diagnostics: BacktestDiagnostics = {
    buySignals: 0,
    sellSignals: 0,
    holdSignals: 0,
    waitSignals: 0,
    buyConfidenceBelow75: 0,
    eligibleBuySignals: 0,
    highestConfidence: 0,
    highestTechnicalScore: 0,
    highestConsensusScore: 0,
  };

  let openTrade:
    | {
        entryPrice: number;
        stopLoss: number;
        takeProfit: number;
        quantity: number;
      }
    | null = null;

  let learningWins = 0;
  let learningLosses = 0;

  const requestedEvaluationCandles =
    evaluationCandles !== undefined &&
    evaluationCandles > 0
      ? Math.floor(evaluationCandles)
      : candles.length;

  const evaluationStart = Math.max(
    50,
    candles.length -
      requestedEvaluationCandles
  );

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

    if (!current) {
      continue;
    }

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

        balance += profit;

        const result =
          profit > 0
            ? "PROFIT"
            : profit < 0
              ? "LOSS"
              : "BREAK EVEN";

        if (result === "PROFIT") {
          learningWins += 1;
        }

        if (result === "LOSS") {
          learningLosses += 1;
        }

        if (
          index >= evaluationStart
        ) {
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
            result,
          });

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
        }

        openTrade = null;
        continue;
      }
    }

    if (openTrade) {
      continue;
    }

    if (
      index <
      evaluationStart
    ) {
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
      analyzeHistoricalMultiTimeframe(
        history
      );

    const consensus =
      buildConsensus(
        multiTimeframe
      );

    const technicalScore =
      marketScore.technicalScore;

    const consensusScore =
      consensus.score;

    const proxyScores =
      calculateMarketProxyScores(
        technical,
        consensusScore
      );

    const riskScore =
      calculateRiskScore(
        technical.atr > 0
          ? (
              technical.atr /
              current.close
            ) *
            100
          : 0
      );

    const decision =
      makeDecision({
        technicalScore,
        newsScore:
          proxyScores.newsScore,
        fundamentalScore:
          proxyScores.fundamentalScore,
        macroScore:
          proxyScores.macroScore,
        sentimentScore:
          proxyScores.sentimentScore,
        riskScore,
        learningScore: 50,
        confidenceWins:
          learningWins,
        confidenceLosses:
          learningLosses,
      });

    if (
      decision.action ===
      "BUY"
    ) {
      diagnostics.buySignals += 1;
    } else if (
      decision.action ===
      "SELL"
    ) {
      diagnostics.sellSignals += 1;
    } else if (
      decision.action ===
      "HOLD"
    ) {
      diagnostics.holdSignals += 1;
    } else {
      diagnostics.waitSignals += 1;
    }

    diagnostics.highestConfidence =
      Math.max(
        diagnostics.highestConfidence,
        decision.confidence
      );

    diagnostics.highestTechnicalScore =
      Math.max(
        diagnostics.highestTechnicalScore,
        technicalScore
      );

    diagnostics.highestConsensusScore =
      Math.max(
        diagnostics.highestConsensusScore,
        consensusScore
      );

    if (
      decision.action ===
        "BUY" &&
      decision.confidence < 75
    ) {
      diagnostics.buyConfidenceBelow75 += 1;
    }

    if (
      decision.action !==
        "BUY" ||
      decision.confidence < 75
    ) {
      continue;
    }

    diagnostics.eligibleBuySignals += 1;

    const stopLossPercent = 2;

    const riskCapital =
      balance * 0.01;

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
        trade.result ===
        "PROFIT"
    ).length;

  const loss =
    trades.filter(
      (trade) =>
        trade.result ===
        "LOSS"
    ).length;

  const breakEven =
    trades.filter(
      (trade) =>
        trade.result ===
        "BREAK EVEN"
    ).length;

  const totalTrades =
    trades.length;

  const winRate =
    totalTrades > 0
      ? (win / totalTrades) *
        100
      : 0;

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
    totalTrades,
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
        : profitFactor,
    maxDrawdown:
      Number(
        maxDrawdown.toFixed(2)
      ),
    trades,
    diagnostics,
  };
}
