import {
  aiMemory,
} from "./aiMemory";

import {
  getPerformance,
} from "./performanceEngine";

export function getLearningData() {

  const memory =
    aiMemory.getAll();

  const performance =
    getPerformance();

  const profitHistory =
    aiMemory.getProfitHistory();

  const lossHistory =
    aiMemory.getLossHistory();

  let confidenceBonus = 0;

  if (
    performance.winRate >= 70
  ) {

    confidenceBonus += 5;

  }

  if (
    performance.totalProfit > 0
  ) {

    confidenceBonus += 5;

  }

  if (
    profitHistory.length >
    lossHistory.length
  ) {

    confidenceBonus += 5;

  }

  const averageConfidence =
    aiMemory.getAverageConfidence();

  const strongestSetup =
    profitHistory.at(-1);

  const weakestSetup =
    lossHistory.at(-1);

  return {

    totalDecision:
      memory.length,

    lastAction:
      memory.length
        ? memory.at(-1)?.action
        : null,

    winRate:
      performance.winRate,

    totalProfit:
      performance.totalProfit,

    averageConfidence:
      Number(
        averageConfidence.toFixed(2)
      ),

    confidenceBonus,

    profitTrade:

      profitHistory.length,

    lossTrade:

      lossHistory.length,

    strongestSetup,

    weakestSetup,

  };

}
