import {
  Position,
} from "./PositionManager";


export type ProfitResult = {

  profit: number;

  profitPercent: number;

  result:
    | "PROFIT"
    | "LOSS"
    | "BREAK EVEN";

};



export function calculateProfit(
  position: Position,
  exitPrice: number
): ProfitResult {


  let profit = 0;


  if (
    position.side === "BUY"
  ) {

    profit =
      (
        exitPrice -
        position.entryPrice
      )
      *
      position.quantity;

  }



  if (
    position.side === "SELL"
  ) {

    profit =
      (
        position.entryPrice -
        exitPrice
      )
      *
      position.quantity;

  }



  const percent =
    (
      (
        exitPrice -
        position.entryPrice
      )
      /
      position.entryPrice
    )
    *
    100;



  let result:
    | "PROFIT"
    | "LOSS"
    | "BREAK EVEN";



  if (profit > 0) {

    result =
      "PROFIT";

  } else if (
    profit < 0
  ) {

    result =
      "LOSS";

  } else {

    result =
      "BREAK EVEN";

  }



  return {

    profit:
      Number(
        profit.toFixed(2)
      ),

    profitPercent:
      Number(
        percent.toFixed(2)
      ),

    result,

  };

}
