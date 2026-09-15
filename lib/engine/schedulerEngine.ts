import { marketHub } from "@/lib/core/market";
import { candleHub } from "@/lib/core/market/candleIndex";
import { aiBrain } from "./aiBrain";
import { getPerformance } from "./performanceEngine";
import { getLearningData } from "./learningEngine";
import { aiMemory } from "./aiMemory";
import { monitorPositions } from "./positionMonitor";

export type SchedulerResult = {
  symbol: string;
  ticker: Awaited<
    ReturnType<typeof marketHub.getTicker>
  >;
  candles: Awaited<
    ReturnType<typeof candleHub.getCandles>
  >;
  brain: Awaited<
    ReturnType<typeof aiBrain.analyze>
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
      await aiBrain.analyze(
        symbol,
        candles
      );

    const lastCandle =
      candles.at(-1);

    if (!lastCandle) {
      throw new Error(
        `Tidak ada candle terakhir untuk ${symbol}`
      );
    }

    const monitor =
      monitorPositions({
        symbol,
        price: ticker.price,
        high: lastCandle.high,
        low: lastCandle.low,
      });

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
  ): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    while (this.running) {
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

      await new Promise<void>(
        (resolve) => {
          setTimeout(
            resolve,
            5000
          );
        }
      );
    }
  }

  stop(): void {
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}

export const schedulerEngine =
  new SchedulerEngine();
