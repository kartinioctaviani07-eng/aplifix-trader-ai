import Card from "@/components/ui/Card";

const markets = [
  {
    name: "BTCUSDT",
    price: "$68,500",
    change: "+2.4%",
  },
  {
    name: "ETHUSDT",
    price: "$3,450",
    change: "+1.2%",
  },
  {
    name: "SOLUSDT",
    price: "$180",
    change: "-0.5%",
  },
];

export default function Watchlist() {
  return (
    <Card title="Market Watchlist">

      <div className="space-y-4">

        {markets.map((market) => (
          <div
            key={market.name}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >

            <div>
              <p className="font-semibold text-white">
                {market.name}
              </p>

              <p className="text-sm text-slate-400">
                {market.price}
              </p>
            </div>

            <p className="font-semibold text-emerald-400">
              {market.change}
            </p>

          </div>
        ))}

      </div>

    </Card>
  );
}
