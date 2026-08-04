import { marketHub } from "@/lib/core/market";
import { aiBrain } from "./aiBrain";
import { runAutoController } from "./autoController";
import { monitorPositions } from "./positionMonitor";
import { getPerformance } from "./performanceEngine";
import { getLearningData } from "./learningEngine";
import { aiMemory } from "./aiMemory";
import { candleHub } from "@/lib/core/market/candleIndex";

export type SchedulerResult = {

  symbol: string;

  ticker: Awaited<
    ReturnType<typeof marketHub.getTicker>
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
    typeof aiMemory.getAll
  >;

  executedAt: number;

};

class SchedulerEngine {

  private running = false;

  async tick(
    symbol: string
  ): Promise<SchedulerResult> {

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

      brain,

      autoTrader,

      monitor,

      performance,

      learning,

      memory,

      executedAt:
        Date.now(),

    };

  }

  async start(
    symbol: string
  ) {

    if (
      this.running
    ) {

      return;

    }

    this.running = true;

    while (
      this.running
    ) {

      try {

        await this.tick(
          symbol
        );

      } catch (error) {

        console.error(
          "Scheduler Error:",
          error
        );

      }

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            5000
          )
      );

    }

  }

  stop() {

    this.running = false;

  }

  isRunning() {

    return this.running;

  }

}

export const schedulerEngine =
  new SchedulerEngine();
