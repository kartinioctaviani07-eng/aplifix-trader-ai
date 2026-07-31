import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  aiFocus,
} from "@/lib/engine/aiFocus";


export async function GET(
  request: NextRequest
) {

  try {


    const symbol =
      request.nextUrl.searchParams.get(
        "symbol"
      );


    const mode =
      request.nextUrl.searchParams.get(
        "mode"
      );



    let focus;



    if(
      mode === "MANUAL" &&
      symbol
    ){

      focus =
        await aiFocus.setManualFocus(
          symbol
        );


    }
    else if(
      mode === "AUTO"
    ){

      aiFocus.setAuto();


      focus =
        await aiFocus.getFocus();


    }
    else {


      focus =
        await aiFocus.getFocus();


    }



    return NextResponse.json({

      success:true,

      mode:
        aiFocus.getMode(),

      focus,

      updatedAt:
        Date.now(),

    });



  }
  catch(error){


    console.error(
      "AI FOCUS ERROR:",
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
