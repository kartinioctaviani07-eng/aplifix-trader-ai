import db from "@/lib/db/database";
import { tradeHistory } from "./tradeHistory";
import {
  positionManager,
  Position,
} from "./PositionManager";

export type CEOAccountSnapshot = {
  initialBalance: number;
  balance: number;
  realizedProfit: number;
  unrealizedProfit: number;
  equity: number;
  totalTrades: number;
  winRate: number;
};

const INITIAL_BALANCE = 10_000_000;

type AccountRow = {
  id: number;
  initial_balance: number;
  balance: number;
  created_at: number;
  updated_at: number;
};

function calculateUnrealizedProfit(
  position: Position
): number {
  if (position.side === "BUY") {
    return (
      (position.currentPrice - position.entryPrice) *
      position.quantity
    );
  }

  return (
    (position.entryPrice - position.currentPrice) *
    position.quantity
  );
}

class CEOAccount {
  private readonly initialBalance: number;
  private balance: number;

  constructor() {
    const existingAccount =
      db
        .prepare(
          `
            SELECT
              id,
              initial_balance,
              balance,
              created_at,
              updated_at
            FROM account
            WHERE id = 1
          `
        )
        .get() as AccountRow | undefined;

    if (existingAccount) {
      this.initialBalance =
        existingAccount.initial_balance;

      this.balance =
        existingAccount.balance;

      return;
    }

    const now = Date.now();

    db.prepare(
      `
        INSERT INTO account (
          id,
          initial_balance,
          balance,
          created_at,
          updated_at
        )
        VALUES (
          1,
          ?,
          ?,
          ?,
          ?
        )
      `
    ).run(
      INITIAL_BALANCE,
      INITIAL_BALANCE,
      now,
      now
    );

    this.initialBalance =
      INITIAL_BALANCE;

    this.balance =
      INITIAL_BALANCE;
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

    db.prepare(
      `
        UPDATE account
        SET
          balance = ?,
          updated_at = ?
        WHERE id = 1
      `
    ).run(
      this.balance,
      Date.now()
    );
  }

  getRealizedProfit(): number {
    return Number(
      (
        this.balance -
        this.initialBalance
      ).toFixed(2)
    );
  }

  getUnrealizedProfit(): number {
    const positions =
      positionManager.getOpenPositions();

    const unrealizedProfit =
      positions.reduce(
        (
          total,
          position
        ) =>
          total +
          calculateUnrealizedProfit(
            position
          ),
        0
      );

    return Number(
      unrealizedProfit.toFixed(2)
    );
  }

  getEquity(): number {
    return Number(
      (
        this.balance +
        this.getUnrealizedProfit()
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
        ? (wins / trades.length) *
          100
        : 0;

    return {
      initialBalance:
        this.initialBalance,

      balance:
        this.balance,

      realizedProfit:
        this.getRealizedProfit(),

      unrealizedProfit:
        this.getUnrealizedProfit(),

      equity:
        this.getEquity(),

      totalTrades:
        trades.length,

      winRate:
        Number(
          winRate.toFixed(2)
        ),
    };
  }
}

export const ceoAccount =
  new CEOAccount();
