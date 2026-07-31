import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  candleHub,
} from "@/lib/core/market/CandleHub";

import "@/lib/core/market/candleIndex";

export async function GET(
  request: NextRequest
) {

  try {

    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";

    const interval =
      request.nextUrl.searchParams.get(
        "interval"
      ) ?? "1h";

    const candles =
      await candleHub.getCandles(
        symbol,
        interval
      );

    return NextResponse.json({

      success: true,

      symbol,

      interval,

      mode:
        candleHub.getLastProvider(),

      data: candles,

    });

  }
  catch (error) {

    console.error(error);

    return NextResponse.json(
      {

        success: false,

        message:
          "Failed to fetch candles",

      },
      {

        status: 500,

      }
    );

  }

}
