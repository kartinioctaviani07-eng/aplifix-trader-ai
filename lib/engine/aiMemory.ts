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

export class AIMemory {

  private records: MemoryRecord[] = [];

  add(
    record: MemoryRecord
  ) {

    this.records.push(record);

  }

  updateResult(

    id: string,

    data: Partial<MemoryRecord>

  ) {

    const index =
      this.records.findIndex(

        (record) =>
          record.id === id

      );

    if (
      index === -1
    ) {

      return;

    }

    this.records[index] = {

      ...this.records[index],

      ...data,

    };

  }

  getAll() {

    return [...this.records];

  }

  getLatest() {

    return this.records.at(-1);

  }

  getBySymbol(
    symbol: string
  ) {

    return this.records.filter(

      (record) =>

        record.symbol === symbol

    );

  }

  getProfitHistory() {

    return this.records.filter(

      (record) =>

        record.result === "PROFIT"

    );

  }

  getLossHistory() {

    return this.records.filter(

      (record) =>

        record.result === "LOSS"

    );

  }

  getAverageConfidence() {

    if (
      this.records.length === 0
    ) {

      return 0;

    }

    return (

      this.records.reduce(

        (
          total,
          record
        ) =>

          total + record.confidence,

        0

      ) /

      this.records.length

    );

  }

  clear() {

    this.records = [];

  }

}

export const aiMemory =
  new AIMemory();
