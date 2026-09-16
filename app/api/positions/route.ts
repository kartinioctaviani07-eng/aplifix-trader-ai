import { NextResponse } from "next/server";

import { positionManager } from "@/lib/engine/PositionManager";

export async function GET() {
  const positions = await positionManager.getAllPositions();
  const openPositions = await positionManager.getOpenPositions();

  return NextResponse.json({
    success: true,
    total: positions.length,
    open: openPositions.length,
    positions,
  });
}
