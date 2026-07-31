import {
  candleHub,
} from "@/lib/core/market/candleIndex";

import {
  Candle,
} from "@/lib/core/market/CandleProvider";


export type {
  Candle,
};


class CandleService {


  async getCandles(
    symbol: string = "BTCUSDT",
    interval: string = "1h"
  ): Promise<Candle[]> {


    return await candleHub.getCandles(
      symbol,
      interval
    );

  }

}


export const candleService =
  new CandleService();
