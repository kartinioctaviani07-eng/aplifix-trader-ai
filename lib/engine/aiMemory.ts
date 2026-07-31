export interface MemoryRecord {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "WAIT";
  confidence: number;
  reason: string[];
  timestamp: number;
}

export class AIMemory {
  private records: MemoryRecord[] = [];

  add(record: MemoryRecord) {
    this.records.push(record);
  }

  getAll(): MemoryRecord[] {
    return [...this.records];
  }

  getBySymbol(symbol: string): MemoryRecord[] {
    return this.records.filter(
      (record) => record.symbol === symbol
    );
  }

  getLatest(): MemoryRecord | undefined {
    return this.records.at(-1);
  }

  clear() {
    this.records = [];
  }
}

export const aiMemory = new AIMemory();
