import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  autoPilotEngine,
} from "@/lib/engine/autoPilotEngine";

export async function GET() {
  try {
    const state =
      await autoPilotEngine.getState();

    return NextResponse.json({
      success: true,
      state,
    });
  } catch (error) {
    console.error(
      "Auto Pilot GET Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal membaca status Auto Pilot.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const action =
      typeof body.action === "string"
        ? body.action.trim().toUpperCase()
        : "";

    if (
      action !== "START" &&
      action !== "STOP"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Action harus START atau STOP.",
        },
        {
          status: 400,
        }
      );
    }

    if (action === "STOP") {
      const state =
        await autoPilotEngine.stop();

      return NextResponse.json({
        success: true,
        action: "STOP",
        state,
      });
    }

    const symbol =
      typeof body.symbol === "string"
        ? body.symbol.trim().toUpperCase()
        : "BTCUSDT";

    const state =
      await autoPilotEngine.activate(
        symbol
      );

    return NextResponse.json({
      success: true,
      action: "START",
      state,
    });
  } catch (error) {
    console.error(
      "Auto Pilot POST Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengubah status Auto Pilot.",
      },
      {
        status: 500,
      }
    );
  }
}
