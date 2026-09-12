import {
  tradeHistory,
} from "./tradeHistory";

export type CEOAccountSnapshot = {
  initialBalance: number;
  balance: number;
  realizedProfit: number;
  equity: number;
  totalTrades: number;
  winRate: number;
};

const INITIAL_BALANCE = 10_000_000;

class CEOAccount {

  private balance: number;

  private readonly initialBalance: number;

  constructor() {
    const store =
      globalThis.__ceoAccountStore;

    this.initialBalance =
      store?.initialBalance ??
      INITIAL_BALANCE;

    this.balance =
      store?.balance ??
      this.initialBalance;

    globalThis.__ceoAccountStore = {
      initialBalance:
        this.initialBalance,
      balance:
        this.balance,
    };
  }

  getBalance(): number {
    return this.balance;
  }

  getInitialBalance(): number {
    return this.initialBalance;
  }

  applyProfit(
    profit: number
  ): void {

    this.balance =
      Number(
        (
          this.balance +
          profit
        ).toFixed(2)
      );

    globalThis.__ceoAccountStore = {
      initialBalance:
        this.initialBalance,
      balance:
        this.balance,
    };
  }

  getRealizedProfit(): number {

    return Number(
      (
        this.balance -
        this.initialBalance
      ).toFixed(2)
    );
  }

  getPositionSize(
    entryPrice: number,
    stopLossPercent: number,
    riskPercent = 1
  ): number {

    if (
      entryPrice <= 0 ||
      stopLossPercent <= 0 ||
      riskPercent <= 0
    ) {
      return 0;
    }

    const riskCapital =
      this.balance *
      (riskPercent / 100);

    const stopDistance =
      entryPrice *
      (stopLossPercent / 100);

    if (
      stopDistance <= 0
    ) {
      return 0;
    }

    const quantity =
      riskCapital /
      stopDistance;

    return Number(
      quantity.toFixed(6)
    );
  }

  getSnapshot(): CEOAccountSnapshot {

    const trades =
      tradeHistory.getAll();

    const wins =
      trades.filter(
        (trade) =>
          trade.profit > 0
      ).length;

    const winRate =
      trades.length > 0
        ? (wins / trades.length) * 100
        : 0;

    return {
      initialBalance:
        this.initialBalance,

      balance:
        this.balance,

      realizedProfit:
        this.getRealizedProfit(),

      equity:
        this.balance,

      totalTrades:
        trades.length,

      winRate:
        Number(
          winRate.toFixed(2)
        ),
    };
  }
}

declare global {
  var __ceoAccountStore:
    | {
        initialBalance: number;
        balance: number;
      }
    | undefined;
}

export const ceoAccount =
  new CEOAccount();
