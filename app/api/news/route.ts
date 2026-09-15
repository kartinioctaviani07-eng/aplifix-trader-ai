import { NextRequest, NextResponse } from "next/server";
import { newsService } from "@/lib/services/newsService";

export async function GET(
  request: NextRequest,
) {
  const symbol =
    request.nextUrl.searchParams.get(
      "symbol",
    ) ?? "BTCUSDT";

  try {
    const news =
      await newsService.getNews(symbol);

    return NextResponse.json({
      success: true,
      symbol,
      provider:
        newsService.getProvider(),
      total: news.length,
      news,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      "[NEWS API ERROR]",
      message,
    );

    return NextResponse.json(
      {
        success: false,
        symbol,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
