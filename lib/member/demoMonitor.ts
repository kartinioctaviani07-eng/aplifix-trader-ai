import { randomUUID } from "node:crypto";

import { marketHub } from "@/lib/core/market";

import { sql } from "@/lib/db/postgres";

export interface DemoMonitorPosition {
  id: string;
  memberId: string;
  demoAccountId: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  status: "OPEN" | "CLOSED";
  exitReason?: "TAKE_PROFIT" | "STOP_LOSS" | "MANUAL";
  updatedAt: number;
}

export interface DemoMonitorResult {
  success: boolean;
  updated: number;
  closed: number;
  positions: DemoMonitorPosition[];
  timestamp: number;
}

interface StoredDemoPosition {
  id: string;
  member_id: string;
  demo_account_id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  status: "OPEN";
  decision_id: string | null;
}

interface ClosedPositionRow {
  id: string;
  member_id: string;
  demo_account_id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  entry_price: number;
  balance_after: number;
}

type ExitReason =
  | "TAKE_PROFIT"
  | "STOP_LOSS";

const STOP_LOSS_PERCENT = 2;
const TAKE_PROFIT_PERCENT = 4;

class DemoMonitor {
  private calculateUnrealizedPnl(
    side: "BUY" | "SELL",
    quantity: number,
    entryPrice: number,
    currentPrice: number
  ): number {
    if (side === "BUY") {
      return (
        (currentPrice - entryPrice) *
        quantity
      );
    }

    return (
      (entryPrice - currentPrice) *
      quantity
    );
  }

  private getExitReason(
    side: "BUY" | "SELL",
    entryPrice: number,
    currentPrice: number
  ): ExitReason | null {
    const stopLossMultiplier =
      1 - STOP_LOSS_PERCENT / 100;

    const takeProfitMultiplier =
      1 + TAKE_PROFIT_PERCENT / 100;

    if (side === "BUY") {
      if (
        currentPrice <=
        entryPrice * stopLossMultiplier
      ) {
        return "STOP_LOSS";
      }

      if (
        currentPrice >=
        entryPrice * takeProfitMultiplier
      ) {
        return "TAKE_PROFIT";
      }

      return null;
    }

    const shortStopLossMultiplier =
      1 + STOP_LOSS_PERCENT / 100;

    const shortTakeProfitMultiplier =
      1 - TAKE_PROFIT_PERCENT / 100;

    if (
      currentPrice >=
      entryPrice * shortStopLossMultiplier
    ) {
      return "STOP_LOSS";
    }

    if (
      currentPrice <=
      entryPrice * shortTakeProfitMultiplier
    ) {
      return "TAKE_PROFIT";
    }

    return null;
  }

  private async closePosition(
    position: StoredDemoPosition,
    currentPrice: number,
    unrealizedPnl: number,
    exitReason: ExitReason,
    now: number
  ): Promise<DemoMonitorPosition | null> {
    const tradeId = randomUUID();

    const positionValue =
      position.quantity *
      position.entry_price;

    const returnedCapital =
      positionValue +
      unrealizedPnl;

    if (
      !Number.isFinite(returnedCapital)
    ) {
      throw new Error(
        "Nilai pengembalian posisi tidak valid."
      );
    }

    const rows = await sql`
      WITH closed_position AS (
        UPDATE member_demo_positions
        SET
          current_price = ${currentPrice},
          unrealized_pnl = ${unrealizedPnl},
          status = 'CLOSED',
          updated_at = ${now}
        WHERE id = ${position.id}
          AND member_id = ${position.member_id}
          AND demo_account_id = ${position.demo_account_id}
          AND status = 'OPEN'
        RETURNING
          id,
          member_id,
          demo_account_id,
          symbol,
          side,
          quantity,
          entry_price
      ),

      updated_account AS (
        UPDATE demo_accounts AS da
        SET
          balance =
            da.balance + ${returnedCapital},
          updated_at = ${now}
        FROM closed_position AS cp
        WHERE da.id = cp.demo_account_id
          AND da.member_id = cp.member_id
        RETURNING
          da.balance
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
          cp.member_id,
          cp.demo_account_id,
          cp.id,
          cp.symbol,
          cp.side,
          cp.quantity,
          ${currentPrice},
          ${unrealizedPnl},
          ${position.decision_id ?? null},
          ${now}
        FROM closed_position AS cp
        CROSS JOIN updated_account AS ua
        RETURNING id
      )

      SELECT
        cp.id,
        cp.member_id,
        cp.demo_account_id,
        cp.symbol,
        cp.side,
        cp.quantity,
        cp.entry_price,
        ua.balance AS balance_after
      FROM closed_position AS cp
      CROSS JOIN updated_account AS ua
      WHERE EXISTS (
        SELECT 1
        FROM inserted_trade
      )
    `;

    const closed =
      rows[0] as
        | ClosedPositionRow
        | undefined;

    if (!closed) {
      const existingRows = await sql`
        SELECT
          id,
          status
        FROM member_demo_positions
        WHERE id = ${position.id}
          AND member_id = ${position.member_id}
        LIMIT 1
      `;

      const existing =
        existingRows[0] as
          | {
              id: string;
              status: string;
            }
          | undefined;

      if (!existing) {
        throw new Error(
          "Posisi Demo tidak ditemukan."
        );
      }

      if (existing.status !== "OPEN") {
        return null;
      }

      throw new Error(
        "Posisi Demo gagal ditutup."
      );
    }

    const balanceAfter =
      Number(closed.balance_after);

    if (balanceAfter < 0) {
      throw new Error(
        "Saldo demo tidak boleh negatif."
      );
    }

    return {
      id: closed.id,
      memberId: closed.member_id,
      demoAccountId:
        closed.demo_account_id,
      symbol: closed.symbol,
      side: closed.side,
      quantity: Number(closed.quantity),
      entryPrice: Number(
        closed.entry_price
      ),
      currentPrice,
      unrealizedPnl,
      status: "CLOSED",
      exitReason,
      updatedAt: now,
    };
  }

  async monitorMember(
    memberId: string
  ): Promise<DemoMonitorResult> {
    const normalizedMemberId =
      memberId.trim();

    if (!normalizedMemberId) {
      throw new Error(
        "Member ID wajib diisi."
      );
    }

    const rows = await sql`
      SELECT
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
        decision_id
      FROM member_demo_positions
      WHERE member_id = ${normalizedMemberId}
        AND status = 'OPEN'
      ORDER BY opened_at ASC
    `;

    const positions =
      rows as StoredDemoPosition[];

    const updatedPositions:
      DemoMonitorPosition[] = [];

    let closedCount = 0;

    const now = Date.now();

    for (const position of positions) {
      const ticker =
        await marketHub.getTicker(
          position.symbol
        );

      const currentPrice =
        ticker.price;

      if (
        !Number.isFinite(currentPrice) ||
        currentPrice <= 0
      ) {
        continue;
      }

      const unrealizedPnl =
        this.calculateUnrealizedPnl(
          position.side,
          position.quantity,
          position.entry_price,
          currentPrice
        );

      const exitReason =
        this.getExitReason(
          position.side,
          position.entry_price,
          currentPrice
        );

      if (exitReason) {
        const closedPosition =
          await this.closePosition(
            position,
            currentPrice,
            unrealizedPnl,
            exitReason,
            now
          );

        if (closedPosition) {
          updatedPositions.push(
            closedPosition
          );

          closedCount += 1;
        }

        continue;
      }

      const updateRows = await sql`
        UPDATE member_demo_positions
        SET
          current_price = ${currentPrice},
          unrealized_pnl = ${unrealizedPnl},
          updated_at = ${now}
        WHERE id = ${position.id}
          AND member_id = ${normalizedMemberId}
          AND status = 'OPEN'
        RETURNING id
      `;

      if (updateRows.length !== 1) {
        continue;
      }

      updatedPositions.push({
        id: position.id,
        memberId: position.member_id,
        demoAccountId:
          position.demo_account_id,
        symbol: position.symbol,
        side: position.side,
        quantity: position.quantity,
        entryPrice: position.entry_price,
        currentPrice,
        unrealizedPnl,
        status: "OPEN",
        updatedAt: now,
      });
    }

    return {
      success: true,
      updated: updatedPositions.length,
      closed: closedCount,
      positions: updatedPositions,
      timestamp: now,
    };
  }
}

export const demoMonitor =
  new DemoMonitor();
