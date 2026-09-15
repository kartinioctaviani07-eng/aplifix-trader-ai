import {
  NextRequest,
  NextResponse,
} from "next/server";

import { aiBrain } from "@/lib/engine/aiBrain";
import { candleHub } from "@/lib/core/market/candleIndex";

const SIGNAL_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
];

export async function GET(
  request: NextRequest
) {
  try {
    const requestedSymbol =
      request.nextUrl.searchParams.get(
        "symbol"
      );

    const symbols = requestedSymbol
      ? [requestedSymbol.toUpperCase()]
      : SIGNAL_SYMBOLS;

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const candles =
          await candleHub.getCandles(
            symbol,
            "1h"
          );

        return await aiBrain.analyze(
          symbol,
          candles
        );
      })
    );

    return NextResponse.json({
      success: true,
      total: results.length,
      data: results,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(
      "AI SIGNALS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to analyze AI signals",
      },
      {
        status: 500,
      }
    );
  }
}
