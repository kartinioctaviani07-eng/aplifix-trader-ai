import { NextResponse } from "next/server";

import { newsService } from "@/lib/services/newsService";

export async function GET() {

  const news =
    await newsService.getNews(
      "BTCUSDT"
    );

  return NextResponse.json({
    success: true,
    provider: newsService.getProvider(),
    total: news.length,
    news,
  });

}
