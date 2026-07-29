import Card from "@/components/ui/Card";

export default function MarketCard() {
  return (
    <Card title="Market Overview">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            BTCUSDT
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Bitcoin / USDT
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-emerald-400">
            +2.45%
          </p>
        </div>
      </div>

    </Card>
  );
}
