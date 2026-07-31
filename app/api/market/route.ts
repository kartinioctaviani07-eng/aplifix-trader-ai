import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  marketHub,
} from "@/lib/core/market";


export async function GET(
  request: NextRequest
) {

  try {

    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";


    const ticker =
      await marketHub.getTicker(
        symbol
      );


    return NextResponse.json({

      success: true,

      provider:
        "MarketHub",

      data:
        ticker,

    });


  } catch(error) {


    console.error(
      "Market API Error:",
      error
    );


    return NextResponse.json(

      {
        success:false,

        message:
          "Failed to fetch market data",
      },

      {
        status:500,
      }

    );


  }

}
