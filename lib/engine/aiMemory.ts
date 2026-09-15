import db from "@/lib/db/database";

export type TradeResult =
  | "PROFIT"
  | "LOSS"
  | "BREAK EVEN"
  | "OPEN";

export interface MemoryRecord {
  id: string;
  symbol: string;
  action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";
  confidence: number;
  reason: string[];
  timestamp: number;
  trend?: string;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  macd?: number;
  atr?: number;
  marketCondition?: string;
  entryPrice?: number;
  exitPrice?: number;
  profit?: number;
  duration?: number;
  result?: TradeResult;
}

type AIDecisionRow = {
  id: string;
  symbol: string;
  action:
    | "BUY"
    | "SELL"
    | "HOLD"
    | "WAIT";
  confidence: number;
  reasons: string;
  trend: string | null;
  ema20: number | null;
  ema50: number | null;
  rsi: number | null;
  macd: number | null;
  atr: number | null;
  market_condition: string | null;
  entry_price: number | null;
  exit_price: number | null;
  profit: number | null;
  duration: number | null;
  result: TradeResult | null;
  timestamp: number;
};

function mapRowToRecord(
  row: AIDecisionRow
): MemoryRecord {
  let reason: string[] = [];

  try {
    const parsed =
      JSON.parse(row.reasons) as unknown;

    if (Array.isArray(parsed)) {
      reason = parsed.filter(
        (item): item is string =>
          typeof item === "string"
      );
    }
  } catch {
    reason = [row.reasons];
  }

  return {
    id: row.id,
    symbol: row.symbol,
    action: row.action,
    confidence: row.confidence,
    reason,
    timestamp: row.timestamp,
    trend: row.trend ?? undefined,
    ema20: row.ema20 ?? undefined,
    ema50: row.ema50 ?? undefined,
    rsi: row.rsi ?? undefined,
    macd: row.macd ?? undefined,
    atr: row.atr ?? undefined,
    marketCondition:
      row.market_condition ?? undefined,
    entryPrice:
      row.entry_price ?? undefined,
    exitPrice:
      row.exit_price ?? undefined,
    profit:
      row.profit ?? undefined,
    duration:
      row.duration ?? undefined,
    result:
      row.result ?? undefined,
  };
}

class AIMemory {
  add(
    record: MemoryRecord
  ): void {
    db.prepare(
      `
        INSERT INTO ai_decisions (
          id,
          symbol,
          action,
          confidence,
          reasons,
          trend,
          ema20,
          ema50,
          rsi,
          macd,
          atr,
          market_condition,
          entry_price,
          exit_price,
          profit,
          duration,
          result,
          timestamp
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
      record.id,
      record.symbol,
      record.action,
      record.confidence,
      JSON.stringify(record.reason),
      record.trend ?? null,
      record.ema20 ?? null,
      record.ema50 ?? null,
      record.rsi ?? null,
      record.macd ?? null,
      record.atr ?? null,
      record.marketCondition ?? null,
      record.entryPrice ?? null,
      record.exitPrice ?? null,
      record.profit ?? null,
      record.duration ?? null,
      record.result ?? null,
      record.timestamp
    );
  }

  updateResult(
    id: string,
    data: Partial<MemoryRecord>
  ): void {
    const existing =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            WHERE id = ?
          `
        )
        .get(id) as
        | AIDecisionRow
        | undefined;

    if (!existing) {
      return;
    }

    const current =
      mapRowToRecord(existing);

    const updated: MemoryRecord = {
      ...current,
      ...data,
    };

    db.prepare(
      `
        UPDATE ai_decisions
        SET
          symbol = ?,
          action = ?,
          confidence = ?,
          reasons = ?,
          trend = ?,
          ema20 = ?,
          ema50 = ?,
          rsi = ?,
          macd = ?,
          atr = ?,
          market_condition = ?,
          entry_price = ?,
          exit_price = ?,
          profit = ?,
          duration = ?,
          result = ?,
          timestamp = ?
        WHERE id = ?
      `
    ).run(
      updated.symbol,
      updated.action,
      updated.confidence,
      JSON.stringify(updated.reason),
      updated.trend ?? null,
      updated.ema20 ?? null,
      updated.ema50 ?? null,
      updated.rsi ?? null,
      updated.macd ?? null,
      updated.atr ?? null,
      updated.marketCondition ?? null,
      updated.entryPrice ?? null,
      updated.exitPrice ?? null,
      updated.profit ?? null,
      updated.duration ?? null,
      updated.result ?? null,
      updated.timestamp,
      updated.id
    );
  }

  getAll(): MemoryRecord[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            ORDER BY timestamp ASC
          `
        )
        .all() as AIDecisionRow[];

    return rows.map(
      mapRowToRecord
    );
  }

  getLatest(): MemoryRecord | undefined {
    const row =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            ORDER BY timestamp DESC
            LIMIT 1
          `
        )
        .get() as
        | AIDecisionRow
        | undefined;

    return row
      ? mapRowToRecord(row)
      : undefined;
  }

  getBySymbol(
    symbol: string
  ): MemoryRecord[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            WHERE symbol = ?
            ORDER BY timestamp ASC
          `
        )
        .all(symbol) as AIDecisionRow[];

    return rows.map(
      mapRowToRecord
    );
  }

  getProfitHistory(): MemoryRecord[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            WHERE result = 'PROFIT'
            ORDER BY timestamp ASC
          `
        )
        .all() as AIDecisionRow[];

    return rows.map(
      mapRowToRecord
    );
  }

  getLossHistory(): MemoryRecord[] {
    const rows =
      db
        .prepare(
          `
            SELECT *
            FROM ai_decisions
            WHERE result = 'LOSS'
            ORDER BY timestamp ASC
          `
        )
        .all() as AIDecisionRow[];

    return rows.map(
      mapRowToRecord
    );
  }

  getAverageConfidence(): number {
    const row =
      db
        .prepare(
          `
            SELECT AVG(confidence) AS average_confidence
            FROM ai_decisions
          `
        )
        .get() as
        | {
            average_confidence:
              | number
              | null;
          }
        | undefined;

    if (
      !row ||
      row.average_confidence === null
    ) {
      return 0;
    }

    return Number(
      row.average_confidence.toFixed(2)
    );
  }

  clear(): void {
    db.prepare(
      `
        DELETE FROM ai_decisions
      `
    ).run();
  }
}

export const aiMemory =
  new AIMemory();
