import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { createOfficeSession } from "@/lib/office/session";

type LoginRequest = {
  email?: unknown;
  password?: unknown;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;

    const email = clean(body.email);
    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const configuredEmail =
      process.env.OFFICE_ADMIN_EMAIL ?? "";

    const configuredPassword =
      process.env.OFFICE_ADMIN_PASSWORD ?? "";

    if (!configuredEmail || !configuredPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Konfigurasi Office belum lengkap.",
        },
        { status: 500 },
      );
    }

    const emailMatches = safeCompare(
      email.toLowerCase(),
      configuredEmail.trim().toLowerCase(),
    );

    const passwordMatches = safeCompare(
      password,
      configuredPassword,
    );

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email atau password Office tidak benar.",
        },
        { status: 401 },
      );
    }

    await createOfficeSession(
      configuredEmail.trim(),
    );

    return NextResponse.json({
      success: true,
      message: "Login Office berhasil.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Login Office belum dapat diproses.",
      },
      { status: 500 },
    );
  }
}
