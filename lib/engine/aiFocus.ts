import {
  marketScanner,
  MarketScanResult,
} from "./marketScanner";

import {
  marketHub,
} from "@/lib/core/market/MarketHub";


type FocusMode =
  | "AUTO"
  | "MANUAL";


class AIFocus {

  private current:
    MarketScanResult | null = null;

  private updatedAt = 0;

  private mode:
    FocusMode = "AUTO";


  async getFocus()
    : Promise<MarketScanResult | null> {


    if (
      this.mode === "MANUAL" &&
      this.current
    ) {

      return this.current;

    }


    const now =
      Date.now();


    if (
      this.current &&
      now - this.updatedAt < 30000
    ) {

      return this.current;

    }


    const markets =
      await marketScanner.scan();


    this.current =
      markets.length > 0
        ? markets[0]
        : null;


    this.updatedAt =
      now;


    return this.current;

  }



  async setManualFocus(
    symbol:string
  ) {


    try {


      const ticker =
        await marketHub.getTicker(
          symbol
        );


      this.current = {

        symbol:
          ticker.symbol,

        price:
          ticker.price,

        change24h:
          ticker.changePercent,

        volume:
          ticker.volume,

        score:
          0,

      };


      this.mode =
        "MANUAL";


      this.updatedAt =
        Date.now();


      return this.current;


    }
    catch(error){

      console.error(
        "Manual focus error",
        error
      );

      return null;

    }

  }



  setAuto(){

    this.mode =
      "AUTO";

    this.current =
      null;

  }



  getMode(){

    return this.mode;

  }



  clear(){

    this.current =
      null;

    this.updatedAt =
      0;

  }


}


export const aiFocus =
  new AIFocus();
