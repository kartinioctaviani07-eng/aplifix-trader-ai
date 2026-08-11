import {
  calculateIndicators,
  Candle,
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

import {
  analyzeSentiment,
} from "./sentimentEngine";

import {
  mockNewsProvider,
} from "@/lib/providers/news/MockNewsProvider";

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

  marketScore:
    ReturnType<
      typeof calculateMarketScore
    >;

  multiTimeframe:
    ReturnType<
      typeof analyzeMultiTimeframe
    >;

  consensus:
    ReturnType<
      typeof buildConsensus
    >;

  sentiment:
    ReturnType<
      typeof analyzeSentiment
    >;

  risk:
    ReturnType<
      typeof calculateRisk
    >;

  learning:
    ReturnType<
      typeof getLearningData
    >;

  decision: Decision;

  positions: OpenPosition[];

  timestamp: number;

}

export class AIBrain {

  async think(
    symbol: string,
    candles: Candle[]
  ): Promise<AIBrainResult> {

    const technical =
      calculateIndicators(
        candles
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
        candles
      );

    const consensus =
      buildConsensus(
        multiTimeframe
      );

    const news =
      await mockNewsProvider.getNews(
        symbol
      );

    const sentiment =
      analyzeSentiment(
        news
      );

    const risk =
      calculateRisk({

        volatility:
          technical.atr,

        stopLossPercent: 3,

        positionSizePercent: 5,

      });

    const learning =
      getLearningData();

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
          sentiment.score,

        fundamentalScore: 50,

        macroScore: 50,

        sentimentScore:
          sentiment.score,

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
          (
            position
          ) =>
            position.symbol === symbol
        );

    return {

      symbol,

      technical,

      marketScore,

      multiTimeframe,

      consensus,

      sentiment,

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
