import { NextResponse } from "next/server";

import { sql } from "@/lib/db/postgres";
import { getOfficeSession } from "@/lib/office/session";

const PARTNERSHIP_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "AGREEMENT",
  "COMPLETED",
] as const;

type PartnershipStatus =
  (typeof PARTNERSHIP_STATUSES)[number];

type StatusCount = {
  status: PartnershipStatus;
  count: number;
};

type RecentPartnership = {
  id: string;
  name: string;
  email: string;
  interest: string;
  status: PartnershipStatus;
  created_at: number;
};

export async function GET() {
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

  try {
    const totalRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM partnership_interests
    `;

    const totalPartnership =
      (totalRows[0] as { count: number } | undefined)
        ?.count ?? 0;

    const statusRows = await sql`
      SELECT
        status,
        COUNT(*)::int AS count
      FROM partnership_interests
      GROUP BY status
    `;

    const statusMap = new Map(
      statusRows.map((row) => [
        String(row.status),
        Number(row.count),
      ]),
    );

    const statusCounts: StatusCount[] =
      PARTNERSHIP_STATUSES.map((status) => ({
        status,
        count: statusMap.get(status) ?? 0,
      }));

    const recentRows = await sql`
      SELECT
        id,
        name,
        email,
        interest,
        status,
        created_at
      FROM partnership_interests
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const recentPartnerships =
      recentRows as RecentPartnership[];

    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
      },
      data: {
        totalPartnership,
        statusCounts,
        recentPartnerships,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Data dashboard belum dapat dibaca.",
      },
      { status: 500 },
    );
  }
}
