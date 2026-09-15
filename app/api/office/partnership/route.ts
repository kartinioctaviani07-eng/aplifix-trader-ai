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

type PartnershipInterest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  status: string;
  created_at: number;
  updated_at: number;
};

type StatusHistory = {
  id: string;
  partnership_id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string;
  created_at: number;
};

type StatusUpdateRequest = {
  id?: unknown;
  status?: unknown;
};

function isPartnershipStatus(
  value: string,
): value is PartnershipStatus {
  return PARTNERSHIP_STATUSES.includes(
    value as PartnershipStatus,
  );
}

function clean(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

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
    const rows = db
      .prepare(
        `
          SELECT
            id,
            name,
            email,
            phone,
            interest,
            message,
            status,
            created_at,
            updated_at
          FROM partnership_interests
          ORDER BY created_at DESC
        `,
      )
      .all() as PartnershipInterest[];

    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
      },
      data: rows,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Data partnership belum dapat dibaca.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
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

  try {
    const body =
      (await request.json()) as StatusUpdateRequest;

    const partnershipId = clean(body.id);
    const newStatus = clean(body.status);

    if (!partnershipId || !newStatus) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ID partnership dan status wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!isPartnershipStatus(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status partnership tidak valid.",
        },
        { status: 400 },
      );
    }

    const partnership = db
      .prepare(
        `
          SELECT
            id,
            status
          FROM partnership_interests
          WHERE id = ?
        `,
      )
      .get(partnershipId) as
      | {
          id: string;
          status: string;
        }
      | undefined;

    if (!partnership) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data partnership tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    const previousStatus = partnership.status;

    if (previousStatus === newStatus) {
      return NextResponse.json({
        success: true,
        message:
          "Status partnership tidak berubah.",
        data: {
          id: partnershipId,
          status: newStatus,
        },
      });
    }

    const now = Date.now();

    const updateStatus = db.transaction(() => {
      db.prepare(
        `
          UPDATE partnership_interests
          SET
            status = ?,
            updated_at = ?
          WHERE id = ?
        `,
      ).run(
        newStatus,
        now,
        partnershipId,
      );

      db.prepare(
        `
          INSERT INTO partnership_status_history (
            id,
            partnership_id,
            previous_status,
            new_status,
            changed_by,
            created_at
          )
          VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
          )
        `,
      ).run(
        crypto.randomUUID(),
        partnershipId,
        previousStatus,
        newStatus,
        session.email,
        now,
      );
    });

    updateStatus();

    return NextResponse.json({
      success: true,
      message:
        "Status partnership berhasil diperbarui.",
      data: {
        id: partnershipId,
        previousStatus,
        status: newStatus,
        changedBy: session.email,
        updatedAt: now,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Status partnership belum dapat diperbarui.",
      },
      { status: 500 },
    );
  }
}
