import { randomUUID } from "node:crypto";

import db from "@/lib/db/database";

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

class DemoExecutor {
  execute(
    input: DemoExecutorInput,
  ): DemoExecutorResult {
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

    const account =
      db.prepare(`
        SELECT
          id,
          member_id,
          balance
        FROM demo_accounts
        WHERE id = ?
          AND member_id = ?
      `).get(
        demoAccountId,
        memberId,
      ) as
        | {
            id: string;
            member_id: string;
            balance: number;
          }
        | undefined;

    if (!account) {
      throw new Error(
        "Demo Account tidak ditemukan atau bukan milik Member.",
      );
    }

    const existingPosition =
      db.prepare(`
        SELECT id
        FROM member_demo_positions
        WHERE member_id = ?
          AND demo_account_id = ?
          AND symbol = ?
          AND status = 'OPEN'
        LIMIT 1
      `).get(
        memberId,
        demoAccountId,
        symbol,
      ) as
        | {
            id: string;
          }
        | undefined;

    if (existingPosition) {
      throw new Error(
        `Sudah ada posisi OPEN untuk ${symbol}.`,
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

    if (positionValue > account.balance) {
      throw new Error(
        "Saldo demo tidak mencukupi untuk membuka posisi.",
      );
    }

    const positionId =
      randomUUID();

    const tradeId =
      randomUUID();

    const now =
      Date.now();

    const transaction =
      db.transaction(() => {
        const updateResult =
          db.prepare(`
            UPDATE demo_accounts
            SET
              balance = balance - ?,
              updated_at = ?
            WHERE id = ?
              AND member_id = ?
              AND balance >= ?
          `).run(
            positionValue,
            now,
            demoAccountId,
            memberId,
            positionValue,
          );

        if (
          updateResult.changes !== 1
        ) {
          throw new Error(
            "Saldo demo tidak mencukupi atau akun tidak dapat diperbarui.",
          );
        }

        const updatedAccount =
          db.prepare(`
            SELECT balance
            FROM demo_accounts
            WHERE id = ?
              AND member_id = ?
          `).get(
            demoAccountId,
            memberId,
          ) as
            | {
                balance: number;
              }
            | undefined;

        if (!updatedAccount) {
          throw new Error(
            "Demo Account gagal diperbarui.",
          );
        }

        if (
          updatedAccount.balance < 0
        ) {
          throw new Error(
            "Saldo demo tidak boleh negatif.",
          );
        }

        db.prepare(`
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?, ?, ?)
        `).run(
          positionId,
          memberId,
          demoAccountId,
          symbol,
          input.side,
          input.quantity,
          input.price,
          input.price,
          0,
          input.decisionId ?? null,
          now,
          now,
        );

        db.prepare(`
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          tradeId,
          memberId,
          demoAccountId,
          positionId,
          symbol,
          input.side,
          input.quantity,
          input.price,
          0,
          input.decisionId ?? null,
          now,
        );

        return updatedAccount.balance;
      });

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
      balanceAfter: transaction(),
      timestamp: now,
    };
  }
}

export const demoExecutor =
  new DemoExecutor();
