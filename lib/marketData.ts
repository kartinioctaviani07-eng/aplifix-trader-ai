export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function getMarketData(): Candle[] {
  return [
    {
      time: "2026-07-20",
      open: 68500,
      high: 69200,
      low: 68100,
      close: 69050,
    },
    {
      time: "2026-07-21",
      open: 69050,
      high: 69500,
      low: 68800,
      close: 69320,
    },
    {
      time: "2026-07-22",
      open: 69320,
      high: 69900,
      low: 69100,
      close: 69780,
    },
    {
      time: "2026-07-23",
      open: 69780,
      high: 70120,
      low: 69450,
      close: 69600,
    },
    {
      time: "2026-07-24",
      open: 69600,
      high: 70550,
      low: 69500,
      close: 70320,
    },
    {
      time: "2026-07-25",
      open: 70320,
      high: 70950,
      low: 70000,
      close: 70780,
    },
    {
      time: "2026-07-26",
      open: 70780,
      high: 71200,
      low: 70550,
      close: 71010,
    },
  ];
}
