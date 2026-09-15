import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  runAutoController,
} from "@/lib/engine/autoController";

export async function GET(
  request: NextRequest
) {
  try {
    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";

    const result =
      await runAutoController(symbol);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Auto Trader API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Auto Trader gagal",
      },
      {
        status: 500,
      }
    );
  }
}
