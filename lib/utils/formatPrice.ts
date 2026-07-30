import { MarketType } from "@/lib/core/market/MarketProvider";

export function formatPrice(
  price: number,
  market: MarketType
): string {
  switch (market) {
    case "stock":
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(price);

    case "forex":
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(price);

    case "commodity":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

    case "crypto":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(price);

    default:
      return price.toString();
  }
}
