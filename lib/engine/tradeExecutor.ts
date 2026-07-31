import {
  positionManager,
  Position,
} from "./PositionManager";

import {
  getMarketData,
} from "@/lib/marketData";


export function executeTrade(
  symbol: string,
  action: "BUY" | "SELL"
) {


  const candles =
    getMarketData();


  const lastCandle =
    candles[candles.length - 1];


  if (!lastCandle) {

    return null;

  }


  const entryPrice =
    lastCandle.close;


  const position: Position = {

    id:
      crypto.randomUUID(),

    symbol,

    side:
      action,

    entryPrice,

    currentPrice:
      entryPrice,

    quantity:
      0.01,

    stopLoss:
      action === "BUY"
        ? entryPrice * 0.98
        : entryPrice * 1.02,


    takeProfit:
      action === "BUY"
        ? entryPrice * 1.04
        : entryPrice * 0.96,


    openedAt:
      Date.now(),


    status:
      "OPEN",

  };


  positionManager.openPosition(
    position
  );


  return position;

}
