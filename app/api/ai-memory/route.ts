import { NextResponse } from "next/server";

import { aiMemory } from "@/lib/engine/aiMemory";

export async function GET() {
  try {
    const history =
      (
        await aiMemory.getAll()
      ).reverse();

    return NextResponse.json({
      success: true,
      total: history.length,
      history,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
