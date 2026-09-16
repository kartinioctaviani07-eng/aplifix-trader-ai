import { NextRequest, NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import { sql } from "@/lib/db/postgres";

import { hashPassword } from "@/lib/member/password";

import { createMemberSession } from "@/lib/member/session";

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama minimal 2 karakter.",
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 8 karakter.",
        },
        { status: 400 },
      );
    }

    const existingMemberRows = await sql`
      SELECT id
      FROM member_accounts
      WHERE email = ${email}
      LIMIT 1
    `;

    const existingMember = existingMemberRows[0] as
      | { id: string }
      | undefined;

    if (existingMember) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email sudah terdaftar sebagai Member.",
        },
        { status: 409 },
      );
    }

    const id = randomUUID();
    const passwordHash = hashPassword(password);
    const now = Date.now();

    await sql`
      INSERT INTO member_accounts (
        id,
        name,
        email,
        password_hash,
        role,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${id},
        ${name},
        ${email},
        ${passwordHash},
        'MEMBER',
        'PENDING_PAYMENT',
        ${now},
        ${now}
      )
    `;

    await createMemberSession(id);

    return NextResponse.json(
      {
        success: true,
        message:
          "Pendaftaran Member berhasil. Silakan lanjutkan ke pembayaran aktivasi.",
        data: {
          memberId: id,
          status: "PENDING_PAYMENT",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Member Register API Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Pendaftaran Member gagal.",
      },
      { status: 500 },
    );
  }
}
