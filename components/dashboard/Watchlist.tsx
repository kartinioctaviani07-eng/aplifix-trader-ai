"use client";

import Card from "@/components/ui/Card";
import { useMarket } from "@/hooks/useMarket";
import { formatPrice } from "@/lib/utils/formatPrice";
import { formatPercent } from "@/lib/utils/formatPercent";

export default function Watchlist() {
  const { watchlist, loading } = useMarket();

  return (
    <Card title="Market Watchlist">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-semibold text-emerald-400">
          Market Watchlist
        </h3>
      </div>

      <div className="mt-4 space-y-5">
        {loading ? (
          <p className="text-sm text-slate-400">
            Loading market...
          </p>
        ) : (
          watchlist.map((market) => (
            <div
              key={market.symbol}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-white">
                  {market.symbol}
                </p>

                <p className="text-xs text-slate-400">
                  {market.name}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  {formatPrice(
                    market.price,
                    market.market
                  )}
                </p>

                <p
                  className={
                    market.changePercent >= 0
                      ? "text-green-400 text-sm"
                      : "text-red-400 text-sm"
                  }
                >
                  {formatPercent(
                    market.changePercent
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
