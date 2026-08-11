import {
  NextResponse,
} from "next/server";

import {
  marketIntelligenceEngine,
} from "@/lib/engine/marketIntelligenceEngine";

export async function GET() {

  try {

    const result =
      await marketIntelligenceEngine.scan();

    return NextResponse.json({

      success: true,

      data: result,

    });

  }

  catch (error) {

    console.error(

      "Market Intelligence API Error:",

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
