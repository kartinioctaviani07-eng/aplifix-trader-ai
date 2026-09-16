import { sql } from "@/lib/db/postgres";

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
  async openPosition(
    position: Position
  ): Promise<boolean> {
    try {
      const rows =
        await sql`
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
            ${position.id},
            ${position.symbol},
            ${position.side},
            ${position.entryPrice},
            ${position.currentPrice},
            ${position.quantity},
            ${position.stopLoss},
            ${position.takeProfit},
            ${position.openedAt},
            ${position.status},
            ${position.decisionId ?? null}
          )
          ON CONFLICT DO NOTHING
          RETURNING id
        `;

      return rows.length > 0;
    } catch {
      return false;
    }
  }

  async hasOpenPosition(
    symbol: string
  ): Promise<boolean> {
    const rows =
      await sql`
        SELECT id
        FROM positions
        WHERE symbol = ${symbol}
          AND status = 'OPEN'
        LIMIT 1
      `;

    return rows.length > 0;
  }

  async getPosition(
    symbol: string
  ): Promise<Position | null> {
    const rows =
      (
        await sql`
          SELECT
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
          FROM positions
          WHERE symbol = ${symbol}
            AND status = 'OPEN'
          LIMIT 1
        `
      ) as PositionRow[];

    const row = rows[0];

    return row
      ? mapRowToPosition(row)
      : null;
  }

  async canOpenPosition(
    symbol: string
  ): Promise<boolean> {
    return !(await this.hasOpenPosition(
      symbol
    ));
  }

  async updatePrice(
    symbol: string,
    price: number
  ): Promise<void> {
    await sql`
      UPDATE positions
      SET current_price = ${price}
      WHERE symbol = ${symbol}
        AND status = 'OPEN'
    `;
  }

  async closePosition(
    id: string
  ): Promise<void> {
    await sql`
      UPDATE positions
      SET status = 'CLOSED'
      WHERE id = ${id}
    `;
  }

  async removeClosedPosition(): Promise<void> {
    await sql`
      DELETE FROM positions
      WHERE status = 'CLOSED'
    `;
  }

  async getOpenPositions(): Promise<Position[]> {
    const rows =
      (
        await sql`
          SELECT
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
          FROM positions
          WHERE status = 'OPEN'
          ORDER BY opened_at ASC
        `
      ) as PositionRow[];

    return rows.map(
      mapRowToPosition
    );
  }

  async getAllPositions(): Promise<Position[]> {
    const rows =
      (
        await sql`
          SELECT
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
          FROM positions
          ORDER BY opened_at ASC
        `
      ) as PositionRow[];

    return rows.map(
      mapRowToPosition
    );
  }
}

export const positionManager =
  new PositionManager();
