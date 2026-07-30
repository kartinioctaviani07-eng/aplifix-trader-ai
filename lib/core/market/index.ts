import { marketHub } from "./MarketHub";
import { mockProvider } from "./MockProvider";
import { BinanceMarketProvider } from "@/lib/providers/BinanceMarketProvider";

marketHub.register(
  new BinanceMarketProvider()
);

marketHub.register(
  mockProvider
);

export { marketHub };
export * from "./MarketProvider";
