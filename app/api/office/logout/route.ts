import { NextResponse } from "next/server";

import { clearOfficeSession } from "@/lib/office/session";

export async function POST() {
  await clearOfficeSession();

  return NextResponse.json({
    success: true,
    message: "Anda telah keluar dari Office.",
  });
}
