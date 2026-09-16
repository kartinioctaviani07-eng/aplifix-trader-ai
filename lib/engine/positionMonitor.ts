import {
  positionManager,
} from "./PositionManager";

import {
  calculateProfit,
} from "./profitEngine";

import {
  tradeHistory,
} from "./tradeHistory";

import {
  ceoAccount,
} from "./ceoAccount";

import {
  aiMemory,
} from "./aiMemory";

export type PositionMonitorInput = {
  symbol: string;
  price: number;
  high: number;
  low: number;
};

export async function monitorPositions(
  input: PositionMonitorInput
) {
  const {
    symbol,
    price,
    high,
    low,
  } = input;

  await positionManager.updatePrice(
    symbol,
    price
  );

  const positions = (
    await positionManager.getOpenPositions()
  ).filter(
    (position) =>
      position.symbol === symbol
  );

  const closed: Array<{
    id: string;
    reason:
      | "TAKE PROFIT"
      | "STOP LOSS";
    profit: ReturnType<
      typeof calculateProfit
    >;
  }> = [];

  for (const position of positions) {
    let reason:
      | "TAKE PROFIT"
      | "STOP LOSS"
      | null = null;

    if (position.side === "BUY") {
      if (
        low <= position.stopLoss
      ) {
        reason = "STOP LOSS";
      } else if (
        high >= position.takeProfit
      ) {
        reason = "TAKE PROFIT";
      }
    }

    if (position.side === "SELL") {
      if (
        high >= position.stopLoss
      ) {
        reason = "STOP LOSS";
      } else if (
        low <= position.takeProfit
      ) {
        reason = "TAKE PROFIT";
      }
    }

    if (!reason) {
      continue;
    }

    const exitPrice =
      reason === "STOP LOSS"
        ? position.stopLoss
        : position.takeProfit;

    const profit =
      calculateProfit(
        position,
        exitPrice
      );

    const closedAt =
      Date.now();

    const duration =
      closedAt -
      position.openedAt;

    ceoAccount.applyProfit(
      profit.profit
    );

    await tradeHistory.add({
      id: position.id,
      symbol: position.symbol,
      side: position.side,
      entryPrice:
        position.entryPrice,
      exitPrice,
      quantity:
        position.quantity,
      profit:
        profit.profit,
      profitPercent:
        profit.profitPercent,
      result:
        profit.result,
      openedAt:
        position.openedAt,
      closedAt,
      decisionId:
        position.decisionId,
    });

    if (position.decisionId) {
      await aiMemory.updateResult(
        position.decisionId,
        {
          entryPrice:
            position.entryPrice,
          exitPrice,
          profit:
            profit.profit,
          duration,
          result:
            profit.result,
        }
      );
    }

    await positionManager.closePosition(
      position.id
    );

    closed.push({
      id: position.id,
      reason,
      profit,
    });
  }

  return {
    price,
    high,
    low,
    closed,
  };
}
