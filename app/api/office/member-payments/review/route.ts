import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import db from "@/lib/db/database";
import { getOfficeSession } from "@/lib/office/session";

type ReviewAction = "APPROVE" | "REJECT";

type PaymentRow = {
  id: string;
  member_id: string;
  status: string;
};

type MemberRow = {
  id: string;
  status: string;
};

function isReviewAction(
  value: unknown,
): value is ReviewAction {
  return (
    value === "APPROVE" ||
    value === "REJECT"
  );
}

export async function POST(
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

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("paymentId" in body) ||
      !("action" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "paymentId dan action wajib diisi.",
        },
        { status: 400 },
      );
    }

    const paymentId =
      typeof body.paymentId === "string"
        ? body.paymentId.trim()
        : "";

    const action = body.action;

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!isReviewAction(action)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Action harus APPROVE atau REJECT.",
        },
        { status: 400 },
      );
    }

    const result = db.transaction(() => {
      const payment = db
        .prepare(
          `
            SELECT
              id,
              member_id,
              status
            FROM member_payments
            WHERE id = ?
            LIMIT 1
          `,
        )
        .get(paymentId) as
        | PaymentRow
        | undefined;

      if (!payment) {
        return {
          success: false as const,
          status: 404,
          message:
            "Data pembayaran tidak ditemukan.",
        };
      }

      const member = db
        .prepare(
          `
            SELECT
              id,
              status
            FROM member_accounts
            WHERE id = ?
            LIMIT 1
          `,
        )
        .get(payment.member_id) as
        | MemberRow
        | undefined;

      if (!member) {
        return {
          success: false as const,
          status: 404,
          message:
            "Data Member tidak ditemukan.",
        };
      }

      if (payment.status !== "PENDING") {
        return {
          success: false as const,
          status: 409,
          message:
            "Pembayaran ini sudah pernah diproses.",
        };
      }

      const now = Date.now();

      if (action === "REJECT") {
        db.prepare(
          `
            UPDATE member_payments
            SET
              status = 'REJECTED',
              reviewed_at = ?,
              reviewed_by = ?
            WHERE id = ?
              AND status = 'PENDING'
          `,
        ).run(
          now,
          session.email,
          paymentId,
        );

        db.prepare(
          `
            UPDATE member_accounts
            SET
              status = 'REJECTED',
              updated_at = ?
            WHERE id = ?
          `,
        ).run(
          now,
          member.id,
        );

        return {
          success: true as const,
          action: "REJECT",
          message:
            "Pembayaran berhasil ditolak.",
        };
      }

      db.prepare(
        `
          UPDATE member_payments
          SET
            status = 'APPROVED',
            reviewed_at = ?,
            reviewed_by = ?
          WHERE id = ?
            AND status = 'PENDING'
        `,
      ).run(
        now,
        session.email,
        paymentId,
      );

      db.prepare(
        `
          UPDATE member_accounts
          SET
            status = 'ACTIVE',
            updated_at = ?
          WHERE id = ?
        `,
      ).run(
        now,
        member.id,
      );

      const existingDemoAccount = db
        .prepare(
          `
            SELECT id
            FROM demo_accounts
            WHERE member_id = ?
            LIMIT 1
          `,
        )
        .get(member.id) as
        | { id: string }
        | undefined;

      if (!existingDemoAccount) {
        db.prepare(
          `
            INSERT INTO demo_accounts (
              id,
              member_id,
              initial_balance,
              balance,
              created_at,
              updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `,
        ).run(
          randomUUID(),
          member.id,
          10000000,
          10000000,
          now,
          now,
        );
      }

      return {
        success: true as const,
        action: "APPROVE",
        message:
          "Pembayaran disetujui. Member telah diaktifkan dan Demo Account tersedia.",
      };
    })();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      action: result.action,
      message: result.message,
    });
  } catch (error) {
    console.error(
      "Office Member Payment Review Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Review pembayaran gagal diproses.",
      },
      { status: 500 },
    );
  }
}
