import {
  NextResponse,
} from "next/server";


import {
  monitorPositions,
} from "@/lib/engine/positionMonitor";


export async function POST(
  request: Request
) {

  const body =
    await request.json();


  const {
    symbol,
    price,
  } = body;



  if (
    !symbol ||
    !price
  ) {

    return NextResponse.json(
      {
        success:false,
        message:
          "symbol dan price wajib ada",
      },
      {
        status:400,
      }
    );

  }



  const result =
    monitorPositions({
      symbol,
      price,
      high: price,
      low: price,
    });



  return NextResponse.json({

    success:true,

    result,

  });


}
