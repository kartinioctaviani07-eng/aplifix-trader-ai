import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  runCEO,
} from "@/lib/engine/ceoOrchestrator";

export async function GET(
  request: NextRequest
) {

  try {

    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";

    const result =
      await runCEO(
        symbol
      );

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {

    console.error(
      "CEO APLIFIX ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "CEO APLIFIX gagal menjalankan analisis.",
      },
      {
        status: 500,
      }
    );
  }
}
