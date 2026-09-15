import db from "@/lib/db/database";
import { marketHub } from "@/lib/core/market";
import { randomUUID } from "node:crypto";

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

type ExitReason = "TAKE_PROFIT" | "STOP_LOSS";

const STOP_LOSS_PERCENT = 2;
const TAKE_PROFIT_PERCENT = 4;

class DemoMonitor {
  private calculateUnrealizedPnl(
    side: "BUY" | "SELL",
    quantity: number,
    entryPrice: number,
    currentPrice: number,
  ): number {
    if (side === "BUY") {
      return (currentPrice - entryPrice) * quantity;
    }

    return (entryPrice - currentPrice) * quantity;
  }

  private getExitReason(
    side: "BUY" | "SELL",
    entryPrice: number,
    currentPrice: number,
  ): ExitReason | null {
    const stopLossMultiplier = 1 - STOP_LOSS_PERCENT / 100;
    const takeProfitMultiplier = 1 + TAKE_PROFIT_PERCENT / 100;

    if (side === "BUY") {
      if (currentPrice <= entryPrice * stopLossMultiplier) {
        return "STOP_LOSS";
      }

      if (currentPrice >= entryPrice * takeProfitMultiplier) {
        return "TAKE_PROFIT";
      }

      return null;
    }

    const shortStopLossMultiplier = 1 + STOP_LOSS_PERCENT / 100;
    const shortTakeProfitMultiplier = 1 - TAKE_PROFIT_PERCENT / 100;

    if (currentPrice >= entryPrice * shortStopLossMultiplier) {
      return "STOP_LOSS";
    }

    if (currentPrice <= entryPrice * shortTakeProfitMultiplier) {
      return "TAKE_PROFIT";
    }

    return null;
  }

  private closePosition(
    position: StoredDemoPosition,
    currentPrice: number,
    unrealizedPnl: number,
    exitReason: ExitReason,
    now: number,
  ): DemoMonitorPosition {
    const tradeId = randomUUID();

    const transaction = db.transaction(() => {
      const account = db
        .prepare(`
          SELECT balance
          FROM demo_accounts
          WHERE id = ?
            AND member_id = ?
        `)
        .get(
          position.demo_account_id,
          position.member_id,
        ) as { balance: number } | undefined;

      if (!account) {
        throw new Error("Demo Account tidak ditemukan.");
      }

      const positionValue =
        position.quantity * position.entry_price;

      const returnedCapital =
        positionValue + unrealizedPnl;

      const newBalance =
        account.balance + returnedCapital;

      if (newBalance < 0) {
        throw new Error("Saldo demo tidak boleh negatif.");
      }

      const updateAccount = db
        .prepare(`
          UPDATE demo_accounts
          SET
            balance = ?,
            updated_at = ?
          WHERE id = ?
            AND member_id = ?
        `)
        .run(
          newBalance,
          now,
          position.demo_account_id,
          position.member_id,
        );

      if (updateAccount.changes !== 1) {
        throw new Error(
          "Gagal memperbarui saldo Demo Account.",
        );
      }

      const updatePosition = db
        .prepare(`
          UPDATE member_demo_positions
          SET
            current_price = ?,
            unrealized_pnl = ?,
            status = 'CLOSED',
            updated_at = ?
          WHERE id = ?
            AND member_id = ?
            AND status = 'OPEN'
        `)
        .run(
          currentPrice,
          unrealizedPnl,
          now,
          position.id,
          position.member_id,
        );

      if (updatePosition.changes !== 1) {
        throw new Error(
          "Posisi Demo sudah ditutup atau tidak ditemukan.",
        );
      }

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
        position.member_id,
        position.demo_account_id,
        position.id,
        position.symbol,
        position.side,
        position.quantity,
        currentPrice,
        unrealizedPnl,
        position.decision_id,
        now,
      );

      return newBalance;
    });

    transaction();

    return {
      id: position.id,
      memberId: position.member_id,
      demoAccountId: position.demo_account_id,
      symbol: position.symbol,
      side: position.side,
      quantity: position.quantity,
      entryPrice: position.entry_price,
      currentPrice,
      unrealizedPnl,
      status: "CLOSED",
      exitReason,
      updatedAt: now,
    };
  }

  async monitorMember(
    memberId: string,
  ): Promise<DemoMonitorResult> {
    const normalizedMemberId = memberId.trim();

    if (!normalizedMemberId) {
      throw new Error("Member ID wajib diisi.");
    }

    const rows = db
      .prepare(`
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
        WHERE member_id = ?
          AND status = 'OPEN'
        ORDER BY opened_at ASC
      `)
      .all(normalizedMemberId) as StoredDemoPosition[];

    const updatedPositions: DemoMonitorPosition[] = [];
    let closedCount = 0;
    const now = Date.now();

    for (const position of rows) {
      const ticker = await marketHub.getTicker(
        position.symbol,
      );

      const currentPrice = ticker.price;

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
          currentPrice,
        );

      const exitReason =
        this.getExitReason(
          position.side,
          position.entry_price,
          currentPrice,
        );

      if (exitReason) {
        const closedPosition =
          this.closePosition(
            position,
            currentPrice,
            unrealizedPnl,
            exitReason,
            now,
          );

        updatedPositions.push(closedPosition);
        closedCount += 1;
        continue;
      }

      const updateResult = db
        .prepare(`
          UPDATE member_demo_positions
          SET
            current_price = ?,
            unrealized_pnl = ?,
            updated_at = ?
          WHERE id = ?
            AND member_id = ?
            AND status = 'OPEN'
        `)
        .run(
          currentPrice,
          unrealizedPnl,
          now,
          position.id,
          normalizedMemberId,
        );

      if (updateResult.changes !== 1) {
        continue;
      }

      updatedPositions.push({
        id: position.id,
        memberId: position.member_id,
        demoAccountId: position.demo_account_id,
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

export const demoMonitor = new DemoMonitor();
