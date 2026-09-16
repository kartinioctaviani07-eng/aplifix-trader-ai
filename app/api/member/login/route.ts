import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/lib/db/postgres";

import {
  createMemberSession,
} from "@/lib/member/session";

import {
  verifyPassword,
} from "@/lib/member/password";

type MemberRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
};

function normalizeEmail(
  value: string,
): string {
  return value.trim().toLowerCase();
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body: unknown =
      await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      !("password" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email dan password wajib diisi.",
        },
        { status: 400 },
      );
    }

    const email =
      typeof body.email === "string"
        ? normalizeEmail(body.email)
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email dan password wajib diisi.",
        },
        { status: 400 },
      );
    }

    const memberRows = await sql`
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        status
      FROM member_accounts
      WHERE email = ${email}
      LIMIT 1
    `;

    const member =
      memberRows[0] as
        | MemberRow
        | undefined;

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email atau password tidak sesuai.",
        },
        { status: 401 },
      );
    }

    const passwordValid =
      verifyPassword(
        password,
        member.password_hash,
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email atau password tidak sesuai.",
        },
        { status: 401 },
      );
    }

    if (member.status !== "ACTIVE") {
      let message =
        "Akun Member belum aktif.";

      if (
        member.status ===
        "PENDING_PAYMENT"
      ) {
        message =
          "Akun belum mengirim bukti pembayaran.";
      }

      if (
        member.status ===
        "PAYMENT_SUBMITTED"
      ) {
        message =
          "Pembayaran masih menunggu verifikasi Office.";
      }

      if (
        member.status ===
        "REJECTED"
      ) {
        message =
          "Akun Member ditolak oleh Office.";
      }

      if (
        member.status ===
        "SUSPENDED"
      ) {
        message =
          "Akun Member sedang ditangguhkan.";
      }

      return NextResponse.json(
        {
          success: false,
          message,
          status: member.status,
        },
        { status: 403 },
      );
    }

    await createMemberSession(
      member.id,
    );

    return NextResponse.json({
      success: true,
      message: "Login Member berhasil.",
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
      },
    });
  } catch (error) {
    console.error(
      "Member Login Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Login Member gagal diproses.",
      },
      { status: 500 },
    );
  }
}
