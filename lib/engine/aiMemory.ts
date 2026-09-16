import { sql } from "@/lib/db/postgres";

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
  reasons: string | string[];
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

function parseReasons(
  reasons: string | string[],
): string[] {
  if (Array.isArray(reasons)) {
    return reasons.filter(
      (item): item is string =>
        typeof item === "string",
    );
  }

  try {
    const parsed =
      JSON.parse(reasons) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string =>
          typeof item === "string",
      );
    }
  } catch {
    return [reasons];
  }

  return [reasons];
}

function mapRowToRecord(
  row: AIDecisionRow,
): MemoryRecord {
  return {
    id: row.id,
    symbol: row.symbol,
    action: row.action,
    confidence: Number(row.confidence),
    reason: parseReasons(row.reasons),
    timestamp: Number(row.timestamp),
    trend:
      row.trend ?? undefined,
    ema20:
      row.ema20 !== null
        ? Number(row.ema20)
        : undefined,
    ema50:
      row.ema50 !== null
        ? Number(row.ema50)
        : undefined,
    rsi:
      row.rsi !== null
        ? Number(row.rsi)
        : undefined,
    macd:
      row.macd !== null
        ? Number(row.macd)
        : undefined,
    atr:
      row.atr !== null
        ? Number(row.atr)
        : undefined,
    marketCondition:
      row.market_condition ??
      undefined,
    entryPrice:
      row.entry_price !== null
        ? Number(row.entry_price)
        : undefined,
    exitPrice:
      row.exit_price !== null
        ? Number(row.exit_price)
        : undefined,
    profit:
      row.profit !== null
        ? Number(row.profit)
        : undefined,
    duration:
      row.duration !== null
        ? Number(row.duration)
        : undefined,
    result:
      row.result ?? undefined,
  };
}

class AIMemory {
  async add(
    record: MemoryRecord,
  ): Promise<void> {
    await sql`
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
        ${record.id},
        ${record.symbol},
        ${record.action},
        ${record.confidence},
        ${JSON.stringify(record.reason)},
        ${record.trend ?? null},
        ${record.ema20 ?? null},
        ${record.ema50 ?? null},
        ${record.rsi ?? null},
        ${record.macd ?? null},
        ${record.atr ?? null},
        ${record.marketCondition ?? null},
        ${record.entryPrice ?? null},
        ${record.exitPrice ?? null},
        ${record.profit ?? null},
        ${record.duration ?? null},
        ${record.result ?? null},
        ${record.timestamp}
      )
    `;
  }

  async updateResult(
    id: string,
    data: Partial<MemoryRecord>,
  ): Promise<void> {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      WHERE id = ${id}
      LIMIT 1
    `;

    const existing =
      rows[0] as AIDecisionRow | undefined;

    if (!existing) {
      return;
    }

    const current =
      mapRowToRecord(existing);

    const updated: MemoryRecord = {
      ...current,
      ...data,
    };

    await sql`
      UPDATE ai_decisions
      SET
        symbol = ${updated.symbol},
        action = ${updated.action},
        confidence = ${updated.confidence},
        reasons = ${JSON.stringify(updated.reason)},
        trend = ${updated.trend ?? null},
        ema20 = ${updated.ema20 ?? null},
        ema50 = ${updated.ema50 ?? null},
        rsi = ${updated.rsi ?? null},
        macd = ${updated.macd ?? null},
        atr = ${updated.atr ?? null},
        market_condition =
          ${updated.marketCondition ?? null},
        entry_price =
          ${updated.entryPrice ?? null},
        exit_price =
          ${updated.exitPrice ?? null},
        profit =
          ${updated.profit ?? null},
        duration =
          ${updated.duration ?? null},
        result =
          ${updated.result ?? null},
        timestamp = ${updated.timestamp}
      WHERE id = ${id}
    `;
  }

  async getAll(): Promise<MemoryRecord[]> {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      ORDER BY timestamp ASC
    `;

    return (
      rows as AIDecisionRow[]
    ).map(mapRowToRecord);
  }

  async getLatest(): Promise<
    MemoryRecord | undefined
  > {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const row =
      rows[0] as AIDecisionRow | undefined;

    return row
      ? mapRowToRecord(row)
      : undefined;
  }

  async getBySymbol(
    symbol: string,
  ): Promise<MemoryRecord[]> {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      WHERE symbol = ${symbol}
      ORDER BY timestamp ASC
    `;

    return (
      rows as AIDecisionRow[]
    ).map(mapRowToRecord);
  }

  async getProfitHistory(): Promise<
    MemoryRecord[]
  > {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      WHERE result = 'PROFIT'
      ORDER BY timestamp ASC
    `;

    return (
      rows as AIDecisionRow[]
    ).map(mapRowToRecord);
  }

  async getLossHistory(): Promise<
    MemoryRecord[]
  > {
    const rows = await sql`
      SELECT *
      FROM ai_decisions
      WHERE result = 'LOSS'
      ORDER BY timestamp ASC
    `;

    return (
      rows as AIDecisionRow[]
    ).map(mapRowToRecord);
  }

  async getAverageConfidence(): Promise<number> {
    const rows = await sql`
      SELECT
        AVG(confidence) AS average_confidence
      FROM ai_decisions
    `;

    const row = rows[0] as
      | {
          average_confidence:
            | number
            | string
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
      Number(
        row.average_confidence,
      ).toFixed(2),
    );
  }

  async clear(): Promise<void> {
    await sql`
      DELETE FROM ai_decisions
    `;
  }
}

export const aiMemory =
  new AIMemory();
