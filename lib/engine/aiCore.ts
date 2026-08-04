import { marketHub } from "@/lib/core/market";
import { candleHub } from "@/lib/core/market/candleIndex";

import { aiBrain } from "./aiBrain";
import { runAutoController } from "./autoController";
import { monitorPositions } from "./positionMonitor";

import { getPerformance } from "./performanceEngine";
import { getLearningData } from "./learningEngine";

import { aiMemory } from "./aiMemory";

export interface AIResult {

  symbol: string;

  ticker: Awaited<
    ReturnType<typeof marketHub.getTicker>
  >;

  candles: Awaited<
    ReturnType<typeof candleHub.getCandles>
  >;

  brain: ReturnType<
    typeof aiBrain.think
  >;

  autoTrader: ReturnType<
    typeof runAutoController
  >;

  monitor: ReturnType<
    typeof monitorPositions
  >;

  performance: ReturnType<
    typeof getPerformance
  >;

  learning: ReturnType<
    typeof getLearningData
  >;

  memory: ReturnType<
    typeof aiMemory.getBySymbol
  >;

  timestamp: number;

}

class AICore {

  async analyze(
    symbol: string
  ): Promise<AIResult> {

    const ticker =
      await marketHub.getTicker(
        symbol
      );

    const candles =
      await candleHub.getCandles(
        symbol,
        "1h"
      );

    const brain =
      aiBrain.think(
        symbol,
        candles
      );

    const autoTrader =
      runAutoController(
        symbol
      );

    const monitor =
      monitorPositions(
        symbol,
        ticker.price
      );

    const performance =
      getPerformance();

    const learning =
      getLearningData();

    const memory =
      aiMemory.getBySymbol(
        symbol
      );

    return {

      symbol,

      ticker,

      candles,

      brain,

      autoTrader,

      monitor,

      performance,

      learning,

      memory,

      timestamp:
        Date.now(),

    };

  }

}

export const aiCore =
  new AICore();
