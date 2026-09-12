import { NextResponse } from "next/server";
import { MockCandleProvider } from "@/lib/providers/candle/MockCandleProvider";
import { runCEOBacktest } from "@/lib/engine/ceoBacktest";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const symbol = searchParams.get("symbol") ?? "BTCUSDT";
    const provider = new MockCandleProvider();

    const candles = await provider.getCandles(symbol, "1h");
    const result = runCEOBacktest(candles);

    return NextResponse.json({
      success: true,
      symbol,
      source: "mock",
      candles: candles.length,
      result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backtest gagal";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
