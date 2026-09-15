export type MacroIndicator = {
  indicator: string;
  value: number;
  date: string;
};

export type MacroMarketData = {
  inflation: MacroIndicator | null;
  unemployment: MacroIndicator | null;
  gdpGrowth: MacroIndicator | null;
  fetchedAt: number;
};

export interface MacroProvider {
  name: string;
  getMarketData(): Promise<MacroMarketData>;
}
