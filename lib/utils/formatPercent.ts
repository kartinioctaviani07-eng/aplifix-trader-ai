export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";

  return `${sign}${value.toFixed(2)}%`;
}
