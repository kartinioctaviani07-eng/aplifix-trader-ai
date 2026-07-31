import {
  aiBrain,
} from "./aiBrain";


import {
  executeTrade,
} from "./tradeExecutor";


import {
  positionManager,
} from "./PositionManager";


import {
  getMarketData,
} from "../marketData";



export function runAutoController(
  symbol: string
) {


  const rawCandles =
    getMarketData();



  const candles =
    rawCandles.map(
      (candle) => ({

        ...candle,

        time:
          new Date(
            candle.time
          ).getTime(),

      })
    );



  const brain =
    aiBrain.think(
      symbol,
      candles
    );



  const decision =
    brain.decision;



  if (
    decision.action === "BUY"
  ) {


    if (
      decision.confidence < 75
    ) {

      return {

        executed: false,

        message:
          "Confidence belum cukup untuk BUY",

        decision,

      };

    }



    if (
      brain.risk.level !== "LOW"
    ) {

      return {

        executed: false,

        message:
          "Risk tidak aman",

        risk:
          brain.risk,

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

        executed: false,

        message:
          "Masih ada posisi terbuka",

        positions:
          existing,

        decision,

      };

    }



    const position =
      executeTrade(
        symbol,
        "BUY"
      );



    return {

      executed: true,

      action:
        "BUY",

      position,

      decision,

    };

  }



  if (
    decision.action === "SELL"
  ) {


    return {

      executed: false,

      message:
        "SELL controller belum diaktifkan",

      decision,

    };

  }



  return {

    executed: false,

    message:
      "AI belum memberikan sinyal entry",

    decision,

  };


}
