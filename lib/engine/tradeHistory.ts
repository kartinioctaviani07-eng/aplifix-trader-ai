import { sql } from "@/lib/db/postgres";

export type TradeRecord = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  result: "PROFIT" | "LOSS" | "BREAK EVEN";
  openedAt: number;
  closedAt: number;
  decisionId?: string;
};

type TradeRow = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entry_price: number;
  exit_price: number;
  quantity: number;
  profit: number;
  profit_percent: number;
  result: "PROFIT" | "LOSS" | "BREAK EVEN";
  opened_at: number;
  closed_at: number;
  decision_id: string | null;
};

function mapRowToTrade(
  row: TradeRow
): TradeRecord {
  return {
    id: row.id,
    symbol: row.symbol,
    side: row.side,
    entryPrice: row.entry_price,
    exitPrice: row.exit_price,
    quantity: row.quantity,
    profit: row.profit,
    profitPercent: row.profit_percent,
    result: row.result,
    openedAt: row.opened_at,
    closedAt: row.closed_at,
    decisionId:
      row.decision_id ?? undefined,
  };
}

class TradeHistory {
  async add(
    trade: TradeRecord
  ): Promise<void> {
    await sql`
      INSERT INTO trades (
        id,
        symbol,
        side,
        entry_price,
        exit_price,
        quantity,
        profit,
        profit_percent,
        result,
        opened_at,
        closed_at,
        decision_id
      )
      VALUES (
        ${trade.id},
        ${trade.symbol},
        ${trade.side},
        ${trade.entryPrice},
        ${trade.exitPrice},
        ${trade.quantity},
        ${trade.profit},
        ${trade.profitPercent},
        ${trade.result},
        ${trade.openedAt},
        ${trade.closedAt},
        ${trade.decisionId ?? null}
      )
    `;
  }

  async getAll(): Promise<TradeRecord[]> {
    const rows =
      (await sql`
        SELECT
          id,
          symbol,
          side,
          entry_price,
          exit_price,
          quantity,
          profit,
          profit_percent,
          result,
          opened_at,
          closed_at,
          decision_id
        FROM trades
        ORDER BY closed_at ASC
      `) as TradeRow[];

    return rows.map(
      mapRowToTrade
    );
  }

  async getLatest():
    Promise<
      TradeRecord | undefined
    > {
    const rows =
      (await sql`
        SELECT
          id,
          symbol,
          side,
          entry_price,
          exit_price,
          quantity,
          profit,
          profit_percent,
          result,
          opened_at,
          closed_at,
          decision_id
        FROM trades
        ORDER BY closed_at DESC
        LIMIT 1
      `) as TradeRow[];

    const row = rows[0];

    return row
      ? mapRowToTrade(row)
      : undefined;
  }

  async clear(): Promise<void> {
    await sql`
      DELETE FROM trades
    `;
  }
}

export const tradeHistory =
  new TradeHistory();
