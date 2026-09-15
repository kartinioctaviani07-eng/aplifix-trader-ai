import { NextResponse } from "next/server";

import db from "@/lib/db/database";
import { getMemberSession } from "@/lib/member/session";
import { demoOrchestrator } from "@/lib/member/demoOrchestrator";

interface MemberAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export async function POST() {
  try {
    const session =
      await getMemberSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sesi Member tidak ditemukan. Silakan login terlebih dahulu.",
        },
        { status: 401 },
      );
    }

    const member =
      db.prepare(`
        SELECT
          id,
          name,
          email,
          role,
          status
        FROM member_accounts
        WHERE id = ?
        LIMIT 1
      `).get(
        session.memberId,
      ) as MemberAccount | undefined;

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data Member tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (
      member.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Member belum aktif sehingga Demo AI belum dapat dijalankan.",
        },
        { status: 403 },
      );
    }

    if (
      member.role !== "MEMBER"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Akun tidak memiliki akses Member Demo.",
        },
        { status: 403 },
      );
    }

    const demoAccount =
      db.prepare(`
        SELECT
          id,
          balance
        FROM demo_accounts
        WHERE member_id = ?
        LIMIT 1
      `).get(
        member.id,
      ) as
        | {
            id: string;
            balance: number;
          }
        | undefined;

    if (!demoAccount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Demo Account belum tersedia.",
        },
        { status: 404 },
      );
    }

    const result =
      await demoOrchestrator.run(
        member.id,
      );

    return NextResponse.json({
      success: true,
      member: {
        name: member.name,
        email: member.email,
      },
      demoAccount: {
        id: demoAccount.id,
      },
      data: result,
    });
  } catch (error) {
    console.error(
      "Member Demo API Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gagal menjalankan Demo AI.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
