import {
  getMarketData,
} from "../marketData";


import {
  aiBrain,
} from "./aiBrain";


import {
  positionManager,
} from "./PositionManager";


export function runAutoTrader(
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



  const action =
    brain.decision.action;



  if (
    action === "BUY"
  ) {


    return {

      action,

      message:
        "AI memberi sinyal BUY",

      confidence:
        brain.decision.confidence,

      brain,

    };

  }



  if (
    action === "SELL"
  ) {


    return {

      action,

      message:
        "AI memberi sinyal SELL",

      confidence:
        brain.decision.confidence,

      brain,

    };

  }



  return {

    action,

    message:
      "AI belum membuka posisi",

    confidence:
      brain.decision.confidence,

    brain,

  };

}
