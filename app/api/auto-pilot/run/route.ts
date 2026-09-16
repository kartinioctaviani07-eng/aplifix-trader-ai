import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  autoPilotEngine,
} from "@/lib/engine/autoPilotEngine";

export async function GET(
  request: NextRequest
) {
  const authorization =
    request.headers.get(
      "authorization"
    );

  const expected =
    process.env.CRON_SECRET;

  if (
    !expected ||
    authorization !==
      `Bearer ${expected}`
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const result =
      await autoPilotEngine.runCycle();

    return NextResponse.json({
      success: true,
      executed: result.executed,
      message: result.message,
      state: result.state,
    });
  } catch (error) {
    console.error(
      "Auto Pilot Runner Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Auto Pilot runner gagal.",
      },
      {
        status: 500,
      }
    );
  }
}
