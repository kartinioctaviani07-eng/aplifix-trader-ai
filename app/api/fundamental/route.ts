import { NextRequest, NextResponse } from "next/server";
import {
  coinGeckoFundamentalProvider,
} from "@/lib/providers/fundamental/CoinGeckoFundamentalProvider";
import {
  analyzeFundamental,
} from "@/lib/engine/fundamentalEngine";

export async function GET(
  request: NextRequest
) {
  const symbol =
    request.nextUrl.searchParams.get(
      "symbol"
    ) ?? "BTCUSDT";

  try {
    const marketData =
      await coinGeckoFundamentalProvider.getMarketData(
        symbol
      );

    const analysis =
      analyzeFundamental(marketData);

    return NextResponse.json({
      success: true,
      symbol: marketData.symbol,
      provider: "CoinGecko Demo",
      data: marketData,
      analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      "[FUNDAMENTAL API ERROR]",
      message
    );

    return NextResponse.json(
      {
        success: false,
        symbol,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
