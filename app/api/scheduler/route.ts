import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  schedulerEngine,
} from "@/lib/engine/schedulerEngine";

export async function GET(
  request: NextRequest
) {

  try {

    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";

    const result =
      await schedulerEngine.tick(
        symbol
      );

    return NextResponse.json({

      success: true,

      data: result,

    });

  } catch (error) {

    console.error(
      "Scheduler API Error:",
      error
    );

    return NextResponse.json(

      {

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error",

      },

      {

        status: 500,

      }

    );

  }

}
