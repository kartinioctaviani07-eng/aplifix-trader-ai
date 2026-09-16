import { sql } from "@/lib/db/postgres";

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
  private account: AccountRow | null = null;

  private async ensureAccount(): Promise<AccountRow> {
    if (this.account) {
      return this.account;
    }

    const existing = (await sql`
      SELECT
        id,
        initial_balance,
        balance,
        created_at,
        updated_at
      FROM account
      WHERE id = 1
      LIMIT 1
    `) as unknown as AccountRow[];

    if (existing.length > 0) {
      this.account = existing[0];
      return existing[0];
    }

    const now = Date.now();

    await sql`
      INSERT INTO account (
        id,
        initial_balance,
        balance,
        created_at,
        updated_at
      )
      VALUES (
        1,
        ${INITIAL_BALANCE},
        ${INITIAL_BALANCE},
        ${now},
        ${now}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    const created = (await sql`
      SELECT
        id,
        initial_balance,
        balance,
        created_at,
        updated_at
      FROM account
      WHERE id = 1
      LIMIT 1
    `) as unknown as AccountRow[];

    if (created.length === 0) {
      throw new Error(
        "CEO account could not be initialized."
      );
    }

    this.account = created[0];

    return created[0];
  }

  private async refreshAccount(): Promise<AccountRow> {
    this.account = null;
    return this.ensureAccount();
  }

  async getBalance(): Promise<number> {
    const account = await this.ensureAccount();
    return account.balance;
  }

  async getInitialBalance(): Promise<number> {
    const account = await this.ensureAccount();
    return account.initial_balance;
  }

  async applyProfit(profit: number): Promise<void> {
    const updated = (await sql`
      UPDATE account
      SET
        balance = balance + ${profit},
        updated_at = ${Date.now()}
      WHERE id = 1
      RETURNING
        id,
        initial_balance,
        balance,
        created_at,
        updated_at
    `) as unknown as AccountRow[];

    if (updated.length > 0) {
      this.account = updated[0];
      return;
    }

    await this.ensureAccount();

    const retry = (await sql`
      UPDATE account
      SET
        balance = balance + ${profit},
        updated_at = ${Date.now()}
      WHERE id = 1
      RETURNING
        id,
        initial_balance,
        balance,
        created_at,
        updated_at
    `) as unknown as AccountRow[];

    if (retry.length === 0) {
      throw new Error(
        "CEO account update failed."
      );
    }

    this.account = retry[0];
  }

  async getRealizedProfit(): Promise<number> {
    const account = await this.ensureAccount();

    return Number(
      (
        account.balance -
        account.initial_balance
      ).toFixed(2)
    );
  }

  async getUnrealizedProfit(): Promise<number> {
    const positions =
      await positionManager.getOpenPositions();

    const unrealizedProfit =
      positions.reduce(
        (total, position) =>
          total +
          calculateUnrealizedProfit(position),
        0
      );

    return Number(
      unrealizedProfit.toFixed(2)
    );
  }

  async getEquity(): Promise<number> {
    const account = await this.ensureAccount();

    const unrealizedProfit =
      await this.getUnrealizedProfit();

    return Number(
      (
        account.balance +
        unrealizedProfit
      ).toFixed(2)
    );
  }

  async getPositionSize(
    entryPrice: number,
    stopLossPercent: number,
    riskPercent = 1
  ): Promise<number> {
    if (
      entryPrice <= 0 ||
      stopLossPercent <= 0 ||
      riskPercent <= 0
    ) {
      return 0;
    }

    const account = await this.ensureAccount();

    const riskCapital =
      account.balance *
      (riskPercent / 100);

    const stopDistance =
      entryPrice *
      (stopLossPercent / 100);

    if (stopDistance <= 0) {
      return 0;
    }

    const quantity =
      riskCapital / stopDistance;

    return Number(
      quantity.toFixed(6)
    );
  }

  async getSnapshot(): Promise<CEOAccountSnapshot> {
    const account =
      await this.refreshAccount();

    const trades =
      await tradeHistory.getAll();

    const wins =
      trades.filter(
        (trade) => trade.profit > 0
      ).length;

    const winRate =
      trades.length > 0
        ? (wins / trades.length) * 100
        : 0;

    const unrealizedProfit =
      await this.getUnrealizedProfit();

    const equity =
      Number(
        (
          account.balance +
          unrealizedProfit
        ).toFixed(2)
      );

    return {
      initialBalance:
        account.initial_balance,
      balance:
        account.balance,
      realizedProfit:
        Number(
          (
            account.balance -
            account.initial_balance
          ).toFixed(2)
        ),
      unrealizedProfit,
      equity,
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
