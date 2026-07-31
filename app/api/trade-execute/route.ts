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
  } = body;



  if (
    !symbol ||
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



  const position =
    executeTrade(
      symbol,
      action
    );



  return NextResponse.json({

    success: true,

    position,

  });


}
