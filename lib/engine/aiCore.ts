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

  brain: Awaited<
    ReturnType<typeof aiBrain.think>
  >;

  autoTrader: Awaited<
    ReturnType<typeof runAutoController>
  >;

  monitor: Awaited<
    ReturnType<typeof monitorPositions>
  >;

  performance: ReturnType<
    typeof getPerformance
  >;

  learning: Awaited<
    ReturnType<typeof getLearningData>
  >;

  memory: Awaited<
    ReturnType<typeof aiMemory.getBySymbol>
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
      await aiBrain.think(
        symbol,
        candles
      );

    const autoTrader =
      await runAutoController(
        symbol
      );

    const lastCandle =
      candles.at(-1);

    if (!lastCandle) {

      throw new Error(
        `Tidak ada candle terakhir untuk ${symbol}`
      );

    }

    const monitor =
      await monitorPositions({
        symbol,
        price: ticker.price,
        high: lastCandle.high,
        low: lastCandle.low,
      });

    const performance =
      getPerformance();

    const learning =
      await getLearningData();

    const memory =
      await aiMemory.getBySymbol(
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
