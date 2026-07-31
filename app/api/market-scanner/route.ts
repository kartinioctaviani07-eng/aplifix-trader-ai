import { NextResponse } from "next/server";

import {
  marketScanner,
} from "@/lib/engine/marketScanner";

export async function GET() {

  try {

    const markets =
      await marketScanner.scan();

    const bestMarket =
      markets.length > 0
        ? markets[0]
        : null;

    return NextResponse.json({

      success: true,

      total: markets.length,

      bestMarket,

      markets,

      updatedAt: Date.now(),

    });

  } catch (error) {

    console.error(
      "MARKET SCANNER ERROR:",
      error
    );

    return NextResponse.json(

      {

        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error",

      },

      {

        status: 500,

      }

    );

  }

}
