import { NextResponse } from "next/server";

import { sql } from "@/lib/db/postgres";

import { getMemberSession } from "@/lib/member/session";

import { demoOrchestrator } from "@/lib/member/demoOrchestrator";

interface MemberAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface DemoAccount {
  id: string;
  balance: number;
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

    const memberRows =
      await sql`
        SELECT
          id,
          name,
          email,
          role,
          status
        FROM member_accounts
        WHERE id = ${session.memberId}
        LIMIT 1
      `;

    const member =
      memberRows[0] as
        | MemberAccount
        | undefined;

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

    const demoAccountRows =
      await sql`
        SELECT
          id,
          balance
        FROM demo_accounts
        WHERE member_id = ${member.id}
        LIMIT 1
      `;

    const demoAccount =
      demoAccountRows[0] as
        | DemoAccount
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
