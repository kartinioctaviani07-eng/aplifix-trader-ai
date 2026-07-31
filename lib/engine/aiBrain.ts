import {
  calculateIndicators,
  Candle,
} from "./indicatorEngine";

import {
  makeDecision,
} from "./decisionEngine";

import {
  calculateRisk,
} from "./riskEngine";

import {
  positionManager,
} from "./PositionManager";

import {
  getLearningData,
} from "./learningEngine";

import {
  aiMemory,
} from "./aiMemory";

type TechnicalAnalysis =
  ReturnType<typeof calculateIndicators>;

type Decision =
  ReturnType<typeof makeDecision>;

type OpenPosition =
  ReturnType<
    typeof positionManager.getOpenPositions
  >[number];

export interface AIBrainResult {

  symbol: string;

  technical: TechnicalAnalysis;

  risk: ReturnType<typeof calculateRisk>;

  learning: ReturnType<typeof getLearningData>;

  decision: Decision;

  positions: OpenPosition[];

  timestamp: number;

}

const TECHNICAL_SCORE_BY_TREND:
  Record<string, number> = {

  Bullish: 80,

  Bearish: 30,

};

const DEFAULT_TECHNICAL_SCORE = 50;

export class AIBrain {

  think(
    symbol: string,
    candles: Candle[]
  ): AIBrainResult {

    const technical =
      calculateIndicators(
        candles
      );

    const technicalScore =
      TECHNICAL_SCORE_BY_TREND[
        technical.trend
      ] ??
      DEFAULT_TECHNICAL_SCORE;

    const risk =
      calculateRisk({

        volatility: 3,

        stopLossPercent: 3,

        positionSizePercent: 5,

      });

    const learning =
      getLearningData();

    const decision =
      makeDecision({

        technicalScore,

        newsScore: 50,

        fundamentalScore: 50,

        macroScore: 50,

        sentimentScore: 50,

        riskScore:
          risk.riskScore,

        learningScore:
          Math.min(
            100,
            50 +
            learning.confidenceBonus
          ),

      });

    aiMemory.add({

      id:
        crypto.randomUUID(),

      symbol,

      action:
        decision.action,

      confidence:
        decision.confidence,

      reason:
        decision.reason,

      timestamp:
        Date.now(),

    });

    const positions =
      positionManager
        .getOpenPositions()
        .filter(
          (position) =>
            position.symbol === symbol
        );

    return {

      symbol,

      technical,

      risk,

      learning,

      decision,

      positions,

      timestamp:
        Date.now(),

    };

  }

}

export const aiBrain =
  new AIBrain();
