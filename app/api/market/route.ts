import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    provider: "APLIFIX",
    data: {
      symbol: "BTCUSDT",
      price: 68942.51,
      change24h: 2.14,
      volume24h: 1245789634,
    },
  });
}
