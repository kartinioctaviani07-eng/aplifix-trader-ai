import {
  NextResponse,
} from "next/server";


import {
  getPerformance,
} from "@/lib/engine/performanceEngine";



export async function GET() {


  const performance =
    getPerformance();



  return NextResponse.json({

    success: true,

    performance,

  });


}
