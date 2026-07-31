import { candleHub } from "./CandleHub";

import { BinanceCandleProvider } from "@/lib/providers/candle/BinanceCandleProvider";
import { MockCandleProvider } from "@/lib/providers/candle/MockCandleProvider";


candleHub.register(
  new BinanceCandleProvider()
);


candleHub.register(
  new MockCandleProvider()
);


export { candleHub };
export * from "./CandleProvider";
