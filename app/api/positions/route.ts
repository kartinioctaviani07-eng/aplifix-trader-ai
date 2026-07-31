import {
  NextResponse,
} from "next/server";


import {
  positionManager,
} from "@/lib/engine/PositionManager";



export async function GET() {


  const positions =
    positionManager.getAllPositions();



  return NextResponse.json({

    success: true,

    total:
      positions.length,

    open:
      positionManager.getOpenPositions()
        .length,

    positions,

  });


}
