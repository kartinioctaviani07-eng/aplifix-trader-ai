export type TradeRecord = {

  id: string;

  symbol: string;

  side:
    | "BUY"
    | "SELL";

  entryPrice: number;

  exitPrice: number;

  quantity: number;

  profit: number;

  profitPercent: number;

  result:
    | "PROFIT"
    | "LOSS"
    | "BREAK EVEN";

  openedAt: number;

  closedAt: number;

};



class TradeHistory {


  private trades: TradeRecord[];



  constructor() {

    this.trades =
      globalThis.__tradeHistoryStore || [];


    globalThis.__tradeHistoryStore =
      this.trades;

  }



  add(
    trade: TradeRecord
  ) {

    this.trades.push(
      trade
    );

  }



  getAll() {

    return [
      ...this.trades
    ];

  }



  getLatest() {

    return this.trades.at(-1);

  }



  clear() {

    this.trades = [];

    globalThis.__tradeHistoryStore =
      this.trades;

  }


}



declare global {

  var __tradeHistoryStore:
    | TradeRecord[]
    | undefined;

}



export const tradeHistory =
  new TradeHistory();
