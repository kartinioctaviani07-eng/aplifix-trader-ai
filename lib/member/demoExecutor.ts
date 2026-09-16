import { randomUUID } from "node:crypto";

import { sql } from "@/lib/db/postgres";

export type DemoExecutorSide =
  | "BUY"
  | "SELL";

export interface DemoExecutorInput {
  memberId: string;
  demoAccountId: string;
  symbol: string;
  side: DemoExecutorSide;
  quantity: number;
  price: number;
  decisionId?: string;
}

export interface DemoExecutorResult {
  success: boolean;
  positionId: string;
  tradeId: string;
  memberId: string;
  demoAccountId: string;
  symbol: string;
  side: DemoExecutorSide;
  quantity: number;
  price: number;
  balanceAfter: number;
  timestamp: number;
}

interface DemoAccountRow {
  id: string;
  member_id: string;
  balance: number;
}

class DemoExecutor {
  async execute(
    input: DemoExecutorInput,
  ): Promise<DemoExecutorResult> {
    const memberId =
      input.memberId.trim();

    const demoAccountId =
      input.demoAccountId.trim();

    const symbol =
      input.symbol.trim().toUpperCase();

    if (!memberId) {
      throw new Error(
        "Member ID wajib diisi.",
      );
    }

    if (!demoAccountId) {
      throw new Error(
        "Demo Account ID wajib diisi.",
      );
    }

    if (!symbol) {
      throw new Error(
        "Symbol wajib diisi.",
      );
    }

    if (
      !Number.isFinite(input.quantity) ||
      input.quantity <= 0
    ) {
      throw new Error(
        "Quantity harus lebih besar dari 0.",
      );
    }

    if (
      !Number.isFinite(input.price) ||
      input.price <= 0
    ) {
      throw new Error(
        "Price harus lebih besar dari 0.",
      );
    }

    const positionValue =
      input.quantity * input.price;

    if (
      !Number.isFinite(positionValue) ||
      positionValue <= 0
    ) {
      throw new Error(
        "Nilai posisi tidak valid.",
      );
    }

    const positionId =
      randomUUID();

    const tradeId =
      randomUUID();

    const now =
      Date.now();

    const rows =
      await sql`
        WITH updated_account AS (
          UPDATE demo_accounts
          SET
            balance = balance - ${positionValue},
            updated_at = ${now}
          WHERE id = ${demoAccountId}
            AND member_id = ${memberId}
            AND balance >= ${positionValue}
            AND NOT EXISTS (
              SELECT 1
              FROM member_demo_positions
              WHERE member_id = ${memberId}
                AND demo_account_id = ${demoAccountId}
                AND symbol = ${symbol}
                AND status = 'OPEN'
            )
          RETURNING
            id,
            member_id,
            balance
        ),
        inserted_position AS (
          INSERT INTO member_demo_positions (
            id,
            member_id,
            demo_account_id,
            symbol,
            side,
            quantity,
            entry_price,
            current_price,
            unrealized_pnl,
            status,
            decision_id,
            opened_at,
            updated_at
          )
          SELECT
            ${positionId},
            ${memberId},
            ${demoAccountId},
            ${symbol},
            ${input.side},
            ${input.quantity},
            ${input.price},
            ${input.price},
            ${0},
            'OPEN',
            ${input.decisionId ?? null},
            ${now},
            ${now}
          FROM updated_account
          RETURNING id
        ),
        inserted_trade AS (
          INSERT INTO member_demo_trades (
            id,
            member_id,
            demo_account_id,
            position_id,
            symbol,
            side,
            quantity,
            price,
            realized_pnl,
            decision_id,
            created_at
          )
          SELECT
            ${tradeId},
            ${memberId},
            ${demoAccountId},
            ${positionId},
            ${symbol},
            ${input.side},
            ${input.quantity},
            ${input.price},
            ${0},
            ${input.decisionId ?? null},
            ${now}
          FROM inserted_position
          RETURNING id
        )
        SELECT
          id,
          member_id,
          balance
        FROM updated_account
        WHERE EXISTS (
          SELECT 1
          FROM inserted_position
        )
        AND EXISTS (
          SELECT 1
          FROM inserted_trade
        )
      `;

    const account =
      rows[0] as
        | DemoAccountRow
        | undefined;

    if (!account) {
      const existingPositionRows =
        await sql`
          SELECT id
          FROM member_demo_positions
          WHERE member_id = ${memberId}
            AND demo_account_id = ${demoAccountId}
            AND symbol = ${symbol}
            AND status = 'OPEN'
          LIMIT 1
        `;

      if (existingPositionRows[0]) {
        throw new Error(
          `Sudah ada posisi OPEN untuk ${symbol}.`,
        );
      }

      const accountRows =
        await sql`
          SELECT
            id,
            member_id,
            balance
          FROM demo_accounts
          WHERE id = ${demoAccountId}
            AND member_id = ${memberId}
          LIMIT 1
        `;

      const existingAccount =
        accountRows[0];

      if (!existingAccount) {
        throw new Error(
          "Demo Account tidak ditemukan atau bukan milik Member.",
        );
      }

      if (
        Number(existingAccount.balance) <
        positionValue
      ) {
        throw new Error(
          "Saldo demo tidak mencukupi untuk membuka posisi.",
        );
      }

      throw new Error(
        "Posisi demo gagal dibuat.",
      );
    }

    const balanceAfter =
      Number(account.balance);

    if (balanceAfter < 0) {
      throw new Error(
        "Saldo demo tidak boleh negatif.",
      );
    }

    return {
      success: true,
      positionId,
      tradeId,
      memberId,
      demoAccountId,
      symbol,
      side: input.side,
      quantity: input.quantity,
      price: input.price,
      balanceAfter,
      timestamp: now,
    };
  }
}

export const demoExecutor =
  new DemoExecutor();
