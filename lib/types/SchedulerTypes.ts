export interface SchedulerTicker {

  symbol: string;

  name: string;

  market: string;

  price: number;

  change: number;

  changePercent: number;

  high: number;

  low: number;

  open: number;

  volume: number;

  timestamp: number;

}

export interface SchedulerResult {

  symbol: string;

  ticker: SchedulerTicker;

  brain: any;

  autoTrader: any;

  monitor: any;

  performance: any;

  learning: any;

  memory: any[];

  executedAt: number;

}
