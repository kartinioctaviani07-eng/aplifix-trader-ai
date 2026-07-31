import {
  NextResponse,
} from "next/server";


import {
  runAutoController,
} from "@/lib/engine/autoController";



export async function GET() {


  const result =
    runAutoController(
      "BTCUSDT"
    );


  return NextResponse.json({

    success: true,

    data: result,

  });


}
