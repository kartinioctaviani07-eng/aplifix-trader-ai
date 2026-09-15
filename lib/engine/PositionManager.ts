import db from "@/lib/db/database";

export type PositionSide =
  | "BUY"
  | "SELL";

export type PositionStatus =
  | "OPEN"
  | "CLOSED";

export interface Position {
  id: string;
  symbol: string;
  side: PositionSide;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
  status: PositionStatus;
  decisionId?: string;
}

type PositionRow = {
  id: string;
  symbol: string;
  side: PositionSide;
  entry_price: number;
  current_price: number;
  quantity: number;
  stop_loss: number;
  take_profit: number;
  opened_at: number;
  status: PositionStatus;
  decision_id: string | null;
};

function mapRowToPosition(
  row: PositionRow
): Position {
  return {
    id: row.id,
    symbol: row.symbol,
    side: row.side,
    entryPrice: row.entry_price,
    currentPrice: row.current_price,
    quantity: row.quantity,
    stopLoss: row.stop_loss,
    takeProfit: row.take_profit,
    openedAt: row.opened_at,
    status: row.status,
    decisionId:
      row.decision_id ?? undefined,
  };
}

class PositionManager {
  openPosition(
    position: Position
  ): boolean {
    if (
      this.hasOpenPosition(
        position.symbol
      )
    ) {
      return false;
    }

    db.prepare(
      `
        INSERT INTO positions (
          id,
          symbol,
          side,
          entry_price,
          current_price,
          quantity,
          stop_loss,
          take_profit,
          opened_at,
          status,
          decision_id
        )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `
    ).run(
      position.id,
      position.symbol,
      position.side,
      position.entryPrice,
      position.currentPrice,
      position.quantity,
      position.stopLoss,
      position.takeProfit,
      position.openedAt,
      position.status,
      position.decisionId ?? null
    );

    return true;
  }

  hasOpenPosition(
    symbol: string
  ): boolean {
    const row =
      db
        .prepare(
          `
            SELECT id
            FROM positions
            WHERE symbol = ?
              AND status = 'OPEN'
            LIMIT 1
          `
        )
        .get(symbol);

    return row !== undefined;
  }

  getPosition(
    symbol: string
  ): Position | null {
    const row =
      db
        .prepare(
          `
            SELECT *
            FROM positions
            WHERE symbol = ?
              AND status = 'OPEN'
            LIMIT 1
          `
        )
        .get(symbol) as
        | PositionRow
        | undefined;

    return row
      ? mapRowToPosition(row)
      : null;
  }

  canOpenPosition(
    symbol: string
  ): boolean {
    return !this.hasOpenPosition(
      symbol
    );
  }

  updatePrice(
    symbol: string,
    price: number
  ): void {
    db.prepare(
      `
        UPDATE positions
        SET current_price = ?
        WHERE symbol = ?
          AND status = 'OPEN'
      `
    ).run(
      price,
      symbol
    );
  }

  closePosition(
    id: string
  ): void {
    db.prepare(
      `
        UPDATE positions
        SET status = 'CLOSED'
        WHERE id = ?
      `
    ).run(id);
  }

  removeClosedPosition(): void {
    db.prepare(
      `
        DELETE FROM positions
        WHERE status = 'CLOSED'
      `
    ).run();
  }

  getOpenPositions(): Position[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM positions
            WHERE status = 'OPEN'
            ORDER BY opened_at ASC
          `
        )
        .all() as PositionRow[];

    return rows.map(
      mapRowToPosition
    );
  }

  getAllPositions(): Position[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM positions
            ORDER BY opened_at ASC
          `
        )
        .all() as PositionRow[];

    return rows.map(
      mapRowToPosition
    );
  }
}

export const positionManager =
  new PositionManager();
