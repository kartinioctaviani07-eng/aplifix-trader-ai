import { NextResponse } from "next/server";
import { analysisService } from "@/lib/services/analysisService";


export async function GET() {
  try {

    const result =
      await analysisService.analyze(
        "BTCUSDT"
      );


    return NextResponse.json({
      success: true,
      data: result,
    });


  } catch (error) {

    console.error(
      "ANALYSIS ERROR:",
      error
    );


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
      }
    );
  }
}
