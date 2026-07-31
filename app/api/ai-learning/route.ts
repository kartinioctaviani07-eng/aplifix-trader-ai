import {
  NextResponse,
} from "next/server";


import {
  getLearningData,
} from "@/lib/engine/learningEngine";



export async function GET() {


  const learning =
    getLearningData();



  return NextResponse.json({

    success: true,

    learning,

  });


}
