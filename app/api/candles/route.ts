import { NextResponse } from "next/server";
import { candleService } from "@/lib/services/candleService";

export async function GET() {
  try {
    const candles =
      await candleService.getCandles(
        "BTCUSDT",
        "1h"
      );

    return NextResponse.json({
      success: true,
      data: candles,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch candles",
      },
      {
        status: 500,
      }
    );
  }
}
