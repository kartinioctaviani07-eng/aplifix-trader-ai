import {
  NextResponse,
} from "next/server";

import {
  ceoAccount,
} from "@/lib/engine/ceoAccount";

export async function GET() {

  return NextResponse.json({
    success: true,

    account:
      ceoAccount.getSnapshot(),
  });
}
