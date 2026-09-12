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

export function monitorPositions(
  symbol: string,
  price: number
) {
  positionManager.updatePrice(
    symbol,
    price
  );

  const positions =
    positionManager
      .getOpenPositions()
      .filter(
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

    if (
      position.side === "BUY"
    ) {
      if (
        price >=
        position.takeProfit
      ) {
        reason =
          "TAKE PROFIT";
      } else if (
        price <=
        position.stopLoss
      ) {
        reason =
          "STOP LOSS";
      }
    }

    if (
      position.side === "SELL"
    ) {
      if (
        price <=
        position.takeProfit
      ) {
        reason =
          "TAKE PROFIT";
      } else if (
        price >=
        position.stopLoss
      ) {
        reason =
          "STOP LOSS";
      }
    }

    if (!reason) {
      continue;
    }

    const profit =
      calculateProfit(
        position,
        price
      );

    ceoAccount.applyProfit(
      profit.profit
    );

    tradeHistory.add({
      id:
        position.id,

      symbol:
        position.symbol,

      side:
        position.side,

      entryPrice:
        position.entryPrice,

      exitPrice:
        price,

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

      closedAt:
        Date.now(),
    });

    positionManager.closePosition(
      position.id
    );

    closed.push({
      id:
        position.id,

      reason,

      profit,
    });
  }

  return {
    price,
    closed,
  };
}
