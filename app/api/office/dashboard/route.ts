import { NextResponse } from "next/server";

import db from "@/lib/db/database";
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
    const totalPartnership = db
      .prepare(
        `
          SELECT COUNT(*) AS count
          FROM partnership_interests
        `,
      )
      .get() as { count: number };

    const statusRows = db
      .prepare(
        `
          SELECT
            status,
            COUNT(*) AS count
          FROM partnership_interests
          GROUP BY status
        `,
      )
      .all() as Array<{
        status: string;
        count: number;
      }>;

    const statusMap = new Map(
      statusRows.map((row) => [
        row.status,
        row.count,
      ]),
    );

    const statusCounts: StatusCount[] =
      PARTNERSHIP_STATUSES.map((status) => ({
        status,
        count: statusMap.get(status) ?? 0,
      }));

    const recentPartnerships = db
      .prepare(
        `
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
        `,
      )
      .all() as RecentPartnership[];

    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
      },
      data: {
        totalPartnership: totalPartnership.count,
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
