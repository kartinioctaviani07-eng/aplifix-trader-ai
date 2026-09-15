import { NextResponse } from "next/server";

import { askAplifixSecretary } from "@/lib/ai/secretaryEngine";

type ChatRequest = {
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan tuliskan pertanyaan Anda.",
        },
        { status: 400 },
      );
    }

    const result = askAplifixSecretary(message);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      intent: result.intent,
      domain: result.domain,
      confidence: Number(
        result.confidence.toFixed(2),
      ),
      actions: result.actions,
      matchedKnowledgeId:
        result.matchedKnowledgeId ?? null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "APLIFIX AI Secretary sedang mengalami gangguan. Silakan coba lagi.",
      },
      { status: 500 },
    );
  }
}
