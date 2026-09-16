import { NextRequest, NextResponse } from "next/server";

import { existsSync, readFileSync } from "node:fs";

import path from "node:path";

import { sql } from "@/lib/db/postgres";

import { getOfficeSession } from "@/lib/office/session";

type PaymentRow = {
  proof_path: string | null;
};

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

export async function GET(
  request: NextRequest,
) {
  const session = await getOfficeSession();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Akses Office diperlukan.",
      },
      { status: 401 },
    );
  }

  const paymentId =
    request.nextUrl.searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json(
      {
        success: false,
        message: "Payment ID wajib diisi.",
      },
      { status: 400 },
    );
  }

  try {
    const paymentRows = await sql`
      SELECT proof_path
      FROM member_payments
      WHERE id = ${paymentId}
      LIMIT 1
    `;

    const payment = paymentRows[0] as
      | PaymentRow
      | undefined;

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data pembayaran tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (!payment.proof_path) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bukti pembayaran belum tersedia.",
        },
        { status: 404 },
      );
    }

    const filePath = path.resolve(
      payment.proof_path,
    );

    const paymentRoot = path.resolve(
      process.cwd(),
      "data",
      "member-payments",
    );

    const relativePath = path.relative(
      paymentRoot,
      filePath,
    );

    if (
      relativePath.startsWith("..") ||
      path.isAbsolute(relativePath)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lokasi file tidak valid.",
        },
        { status: 403 },
      );
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File bukti pembayaran tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const extension =
      path.extname(filePath).toLowerCase();

    const contentType =
      MIME_TYPES[extension];

    if (!contentType) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Format file tidak didukung.",
        },
        { status: 415 },
      );
    }

    const file = readFileSync(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length":
          file.length.toString(),
        "Cache-Control":
          "private, no-store, max-age=0",
        "Content-Disposition":
          contentType === "application/pdf"
            ? "inline"
            : "inline",
      },
    });
  } catch (error) {
    console.error(
      "Office Member Payment Proof Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Bukti pembayaran belum dapat ditampilkan.",
      },
      { status: 500 },
    );
  }
}
