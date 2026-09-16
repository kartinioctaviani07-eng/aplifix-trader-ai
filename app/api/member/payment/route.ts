import { NextRequest, NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import { mkdir, writeFile } from "node:fs/promises";

import path from "node:path";

import { sql } from "@/lib/db/postgres";

import { getMemberSession } from "@/lib/member/session";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["application/pdf", "pdf"],
]);

export async function POST(request: NextRequest) {
  try {
    const session = await getMemberSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sesi Member tidak ditemukan. Silakan daftar atau login kembali.",
        },
        { status: 401 },
      );
    }

    const memberRows = await sql`
      SELECT id, status
      FROM member_accounts
      WHERE id = ${session.memberId}
      LIMIT 1
    `;

    const member = memberRows[0] as
      | {
          id: string;
          status: string;
        }
      | undefined;

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (member.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Member tidak berada pada tahap pembayaran.",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("proof");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bukti pembayaran wajib diunggah.",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File bukti pembayaran kosong.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ukuran file maksimal 5 MB.",
        },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES.get(file.type);

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Format file harus JPG, PNG, atau PDF.",
        },
        { status: 400 },
      );
    }

    const paymentId = randomUUID();

    const filename = `${paymentId}.${extension}`;

    const directory = path.join(
      process.cwd(),
      "data",
      "member-payments",
      member.id,
    );

    await mkdir(directory, {
      recursive: true,
    });

    const filePath = path.join(
      directory,
      filename,
    );

    const buffer = Buffer.from(
      await file.arrayBuffer(),
    );

    await writeFile(filePath, buffer);

    const now = Date.now();

    await sql.transaction([
      sql`
        INSERT INTO member_payments (
          id,
          member_id,
          amount,
          payment_method,
          proof_path,
          status,
          submitted_at
        )
        VALUES (
          ${paymentId},
          ${member.id},
          ${10000},
          ${"BCA"},
          ${filePath},
          ${"PENDING"},
          ${now}
        )
      `,
      sql`
        UPDATE member_accounts
        SET
          status = ${"PAYMENT_SUBMITTED"},
          updated_at = ${now}
        WHERE id = ${member.id}
      `,
    ]);

    return NextResponse.json({
      success: true,
      message:
        "Bukti pembayaran berhasil dikirim dan menunggu verifikasi Office.",
      data: {
        paymentId,
        status: "PAYMENT_SUBMITTED",
      },
    });
  } catch (error) {
    console.error(
      "Member Payment Upload Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Upload bukti pembayaran gagal.",
      },
      { status: 500 },
    );
  }
}
