import {
  NextResponse,
} from "next/server";

import {
  executeTrade,
} from "@/lib/engine/tradeExecutor";

export async function POST(
  request: Request
) {
  const body =
    await request.json();

  const {
    symbol,
    action,
    decisionId,
  } = body;

  if (
    typeof symbol !== "string" ||
    symbol.length === 0 ||
    !action
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Symbol dan action wajib diisi",
      },
      {
        status: 400,
      }
    );
  }

  if (
    action !== "BUY" &&
    action !== "SELL"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Action harus BUY atau SELL",
      },
      {
        status: 400,
      }
    );
  }

  if (
    decisionId !== undefined &&
    typeof decisionId !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "decisionId harus berupa string",
      },
      {
        status: 400,
      }
    );
  }

  const position =
    await executeTrade(
      symbol,
      action,
      decisionId
    );

  if (!position) {
    return NextResponse.json(
      {
        success: false,
        status: "TRADE_NOT_EXECUTED",
        message:
          "Trade tidak dieksekusi. Risk Manager, posisi existing, market data, atau parameter perdagangan menolak pembukaan posisi.",
        position: null,
      },
      {
        status: 200,
      }
    );
  }

  return NextResponse.json({
    success: true,
    status: "EXECUTED",
    message:
      `Posisi ${action} ${symbol} berhasil dibuka.`,
    position,
  });
}
