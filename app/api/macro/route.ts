import { NextResponse } from "next/server";
import { worldBankMacroProvider } from "@/lib/providers/macro/WorldBankMacroProvider";
import { analyzeMacro } from "@/lib/engine/macroEngine";

export async function GET() {
  try {
    const marketData =
      await worldBankMacroProvider.getMarketData();

    const analysis = analyzeMacro(
      marketData,
      worldBankMacroProvider.name,
    );

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown macro error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
