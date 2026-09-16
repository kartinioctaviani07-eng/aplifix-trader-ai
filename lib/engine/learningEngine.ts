import {
  aiMemory,
} from "./aiMemory";

import {
  getPerformance,
} from "./performanceEngine";

export async function getLearningData() {
  const memory =
    await aiMemory.getAll();

  const performance =
    await getPerformance();

  const profitHistory =
    await aiMemory.getProfitHistory();

  const lossHistory =
    await aiMemory.getLossHistory();

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
    await aiMemory.getAverageConfidence();

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
        averageConfidence.toFixed(2),
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
