import { NextResponse } from "next/server";
import { ceoAccount } from "@/lib/engine/ceoAccount";

export async function GET() {
  const account = await ceoAccount.getSnapshot();

  return NextResponse.json({
    success: true,
    account,
  });
}
