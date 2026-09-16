import {
  NextResponse,
} from "next/server";

import {
  tradeHistory,
} from "@/lib/engine/tradeHistory";

export async function GET() {
  const history =
    await tradeHistory.getAll();

  return NextResponse.json({
    success: true,
    total:
      history.length,
    history,
  });
}
