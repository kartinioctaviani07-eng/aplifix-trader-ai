import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  aiBrain,
} from "@/lib/engine/aiBrain";

import {
  candleHub,
} from "@/lib/core/market/candleIndex";


export async function GET(
  request: NextRequest
) {

  try {


    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";



    const candles =
      await candleHub.getCandles(
        symbol,
        "1h"
      );



    const result =
      aiBrain.think(
        symbol,
        candles
      );



    return NextResponse.json({

      success:true,

      data:
        result,

    });



  } catch(error) {


    console.error(
      "AI BRAIN ERROR:",
      error
    );



    return NextResponse.json(

      {
        success:false,

        message:
          error instanceof Error
          ? error.message
          : "Unknown error",
      },

      {
        status:500,
      }

    );


  }

}
