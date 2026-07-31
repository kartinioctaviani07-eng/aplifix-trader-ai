import {
  runAutoTrader,
} from "./autoTrader";

import {
  positionManager,
} from "./PositionManager";

import {
  getMarketData,
} from "../marketData";



export function executeAutoTrade(
  symbol: string
) {


  const decision =
    runAutoTrader(
      symbol
    );



  if (
    decision.action !== "BUY"
  ) {

    return {

      executed: false,

      decision,

    };

  }



  const existing =
    positionManager
      .getOpenPositions()
      .filter(
        (position) =>
          position.symbol === symbol
      );



  if (
    existing.length > 0
  ) {

    return {

      executed:false,

      message:
        "Position masih terbuka",

      decision,

    };

  }



  const candles =
    getMarketData();



  const price =
    candles[
      candles.length - 1
    ].close;



  const position = {

    id:
      crypto.randomUUID(),

    symbol,

    side:
      "BUY" as const,

    entryPrice:
      price,

    currentPrice:
      price,

    quantity:
      0.01,

    stopLoss:
      price * 0.98,

    takeProfit:
      price * 1.04,

    openedAt:
      Date.now(),

    status:
      "OPEN" as const,

  };



  positionManager.openPosition(
    position
  );



  return {

    executed:true,

    position,

    decision,

  };


}
