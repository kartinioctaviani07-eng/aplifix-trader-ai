import {
  tradeHistory,
} from "./tradeHistory";


export type PerformanceResult = {

  totalTrade: number;

  win: number;

  loss: number;

  breakEven: number;

  winRate: number;

  totalProfit: number;

  averageProfit: number;

  averageLoss: number;

};



export function getPerformance()
: PerformanceResult {


  const trades =
    tradeHistory.getAll();



  const totalTrade =
    trades.length;



  const win =
    trades.filter(
      (trade) =>
        trade.result === "PROFIT"
    ).length;



  const loss =
    trades.filter(
      (trade) =>
        trade.result === "LOSS"
    ).length;



  const breakEven =
    trades.filter(
      (trade) =>
        trade.result === "BREAK EVEN"
    ).length;



  const totalProfit =
    trades.reduce(
      (
        total,
        trade
      ) =>
        total + trade.profit,
      0
    );



  const profitTrades =
    trades.filter(
      (trade) =>
        trade.profit > 0
    );



  const lossTrades =
    trades.filter(
      (trade) =>
        trade.profit < 0
    );



  const averageProfit =
    profitTrades.length
      ?
      profitTrades.reduce(
        (
          total,
          trade
        ) =>
          total + trade.profit,
        0
      )
      /
      profitTrades.length
      :
      0;



  const averageLoss =
    lossTrades.length
      ?
      lossTrades.reduce(
        (
          total,
          trade
        ) =>
          total + trade.profit,
        0
      )
      /
      lossTrades.length
      :
      0;



  const winRate =
    totalTrade
      ?
      (
        win /
        totalTrade
      )
      *
      100
      :
      0;



  return {

    totalTrade,

    win,

    loss,

    breakEven,

    winRate:
      Number(
        winRate.toFixed(2)
      ),

    totalProfit:
      Number(
        totalProfit.toFixed(2)
      ),

    averageProfit:
      Number(
        averageProfit.toFixed(2)
      ),

    averageLoss:
      Number(
        averageLoss.toFixed(2)
      ),

  };

}
