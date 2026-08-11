import { NextResponse } from "next/server";

import {
  getDashboardAIData,
} from "@/lib/engine/dashboardAIEngine";

export async function GET() {

  try {

    const data =
      await getDashboardAIData(
        "BTCUSDT"
      );

    return NextResponse.json(
      data
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load dashboard AI",
      },
      {
        status: 500,
      }
    );

  }

}
