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
  analyzeFundamental,
} from "./fundamentalEngine";

import {
  analyzeMacro,
} from "./macroEngine";

import {
  coinGeckoFundamentalProvider,
} from "@/lib/providers/fundamental/CoinGeckoFundamentalProvider";

import {
  worldBankMacroProvider,
} from "@/lib/providers/macro/WorldBankMacroProvider";

import {
  newsService,
} from "@/lib/services/newsService";

type TechnicalAnalysis =
  ReturnType<typeof calculateIndicators>;

type Decision =
  ReturnType<typeof makeDecision>;

type OpenPosition =
  ReturnType<
    typeof positionManager.getOpenPositions
  >[number];

type FundamentalAnalysis =
  ReturnType<typeof analyzeFundamental>;

type MacroAnalysis =
  ReturnType<typeof analyzeMacro>;

export interface AIBrainResult {
  symbol: string;

  technical: TechnicalAnalysis;

  marketScore: ReturnType<
    typeof calculateMarketScore
  >;

  multiTimeframe: Awaited<
    ReturnType<typeof analyzeMultiTimeframe>
  >;

  consensus: ReturnType<typeof buildConsensus>;

  sentiment: ReturnType<typeof analyzeSentiment>;

  fundamental: FundamentalAnalysis;

  macro: MacroAnalysis;

  risk: ReturnType<typeof calculateRisk>;

  learning: ReturnType<typeof getLearningData>;

  decision: Decision;

  positions: OpenPosition[];

  timestamp: number;
}

export class AIBrain {
  private async analyzeInternal(
    symbol: string,
    candles: Candle[],
  ): Promise<AIBrainResult> {
    const technical =
      calculateIndicators(
        candles,
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
      await analyzeMultiTimeframe(
        symbol,
      );

    const consensus =
      buildConsensus(
        multiTimeframe,
      );

    const news =
      await newsService.getNews(
        symbol,
      );

    const sentiment =
      analyzeSentiment(
        news,
      );

    const fundamentalMarketData =
      await coinGeckoFundamentalProvider.getMarketData(
        symbol,
      );

    const fundamental =
      analyzeFundamental(
        fundamentalMarketData,
      );

    const macroMarketData =
      await worldBankMacroProvider.getMarketData();

    const macro =
      analyzeMacro(
        macroMarketData,
        worldBankMacroProvider.name,
      );

    const latestClose =
      candles.at(-1)?.close ?? 0;

    const volatilityPercent =
      latestClose > 0
        ? (
            technical.atr /
            latestClose
          ) * 100
        : 0;

    const risk =
      calculateRisk({
        volatility:
          volatilityPercent,

        stopLossPercent:
          3,

        positionSizePercent:
          5,
      });

    const learning =
      getLearningData();

    const technicalScore =
      Math.round(
        marketScore.technicalScore * 0.30 +
        multiTimeframe.averageScore * 0.70,
      );

    const learningScore =
      Math.min(
        100,
        50 +
          learning.confidenceBonus,
      );

    const decision =
      makeDecision({
        technicalScore,

        newsScore:
          sentiment.score,

        fundamentalScore:
          fundamental.score,

        macroScore:
          macro.score,

        sentimentScore:
          sentiment.score,

        riskScore:
          risk.riskScore,

        learningScore,
      });

    const positions =
      positionManager
        .getOpenPositions()
        .filter(
          (position) =>
            position.symbol ===
            symbol,
        );

    return {
      symbol,

      technical,

      marketScore,

      multiTimeframe,

      consensus,

      sentiment,

      fundamental,

      macro,

      risk,

      learning,

      decision,

      positions,

      timestamp:
        Date.now(),
    };
  }

  async analyze(
    symbol: string,
    candles: Candle[],
  ): Promise<AIBrainResult> {
    return this.analyzeInternal(
      symbol,
      candles,
    );
  }

  async think(
    symbol: string,
    candles: Candle[],
  ): Promise<AIBrainResult> {
    const result =
      await this.analyzeInternal(
        symbol,
        candles,
      );

    aiMemory.add({
      id:
        result.decision.id,

      symbol:
        result.symbol,

      action:
        result.decision.action,

      confidence:
        result.decision.confidence,

      reason:
        result.decision.reason,

      timestamp:
        Date.now(),

      trend:
        result.technical.trend,

      ema20:
        result.technical.ema20,

      ema50:
        result.technical.ema50,

      rsi:
        result.technical.rsi,

      macd:
        result.technical.macd,

      atr:
        result.technical.atr,

      marketCondition:
        result.multiTimeframe
          .overallTrend,
    });

    return result;
  }
}

export const aiBrain =
  new AIBrain();
