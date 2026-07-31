import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  analysisCacheService,
} from "@/lib/services/analysisCacheService";


export async function GET(
  request: NextRequest
) {

  try {


    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      ) ?? "BTCUSDT";



    const result =
      await analysisCacheService.getAnalysis(
        symbol
      );



    return NextResponse.json({

      success: true,

      symbol,

      data: result,

    });



  } catch(error) {


    console.error(
      "ANALYSIS ERROR:",
      error
    );


    return NextResponse.json(

      {

        success:false,

        message:
          error instanceof Error
          ? error.message
          : "Unknown error",

      },

      {
        status:500,
      }

    );


  }

}
