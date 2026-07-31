import {
  positionManager,
} from "./PositionManager";


import {
  calculateProfit,
} from "./profitEngine";


import {
  tradeHistory,
} from "./tradeHistory";



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



  const closed = [];



  for (const position of positions) {


    let reason:
      | "TAKE PROFIT"
      | "STOP LOSS"
      | null = null;



    if (
      position.side === "BUY" &&
      price >= position.takeProfit
    ) {

      reason =
        "TAKE PROFIT";

    }



    if (
      position.side === "BUY" &&
      price <= position.stopLoss
    ) {

      reason =
        "STOP LOSS";

    }



    if (
      reason
    ) {


      const profit =
        calculateProfit(
          position,
          price
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


  }



  return {

    price,

    closed,

  };


}
