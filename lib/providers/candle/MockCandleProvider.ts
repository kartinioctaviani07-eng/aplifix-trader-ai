import {
  CandleProvider,
  Candle,
} from "@/lib/core/market/CandleProvider";


export class MockCandleProvider
  implements CandleProvider
{

  name = "Mock Candle";


  supports(
    symbol: string
  ): boolean {

    return true;

  }



  async getCandles(
    symbol: string,
    interval: string = "1h"
  ): Promise<Candle[]> {


    const now =
      Math.floor(
        Date.now() / 1000
      );



    const basePrices: Record<string, number> = {

      BTCUSDT: 68000,

      ETHUSDT: 3500,

      BNBUSDT: 600,

      SOLUSDT: 170,

      XRPUSDT: 0.5,

      ADAUSDT: 0.8,

      DOGEUSDT: 0.15,

      AVAXUSDT: 35,

      LINKUSDT: 15,

      SUIUSDT: 2,

    };



    let price =
      basePrices[symbol]
      ??
      100;



    const candles: Candle[] = [];



    const volatility =
      price * 0.01;



    for(
      let i = 50;
      i >= 0;
      i--
    ) {


      const open =
        price;



      const move =
        (
          Math.random()
          *
          volatility
          *
          2
        )
        -
        volatility;



      const close =
        open + move;



      const high =
        Math.max(
          open,
          close
        )
        +
        Math.random()
        *
        volatility;



      const low =
        Math.min(
          open,
          close
        )
        -
        Math.random()
        *
        volatility;



      candles.push({

        time:
          now -
          i *
          3600,


        open:
          Number(
            open.toFixed(2)
          ),


        high:
          Number(
            high.toFixed(2)
          ),


        low:
          Number(
            low.toFixed(2)
          ),


        close:
          Number(
            close.toFixed(2)
          ),

      });



      price =
        close;


    }



    return candles;

  }

}
