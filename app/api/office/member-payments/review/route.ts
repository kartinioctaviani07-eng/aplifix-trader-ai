import { NextRequest, NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import { sql } from "@/lib/db/postgres";
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

type UpdatedPaymentRow = {
  member_id: string;
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

    const paymentRows = await sql`
      SELECT
        id,
        member_id,
        status
      FROM member_payments
      WHERE id = ${paymentId}
      LIMIT 1
    `;

    const payment =
      paymentRows[0] as PaymentRow | undefined;

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

    const memberRows = await sql`
      SELECT
        id,
        status
      FROM member_accounts
      WHERE id = ${payment.member_id}
      LIMIT 1
    `;

    const member =
      memberRows[0] as MemberRow | undefined;

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

    if (payment.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pembayaran ini sudah pernah diproses.",
        },
        { status: 409 },
      );
    }

    const now = Date.now();

    if (action === "REJECT") {
      const rows = await sql`
        WITH updated_payment AS (
          UPDATE member_payments
          SET
            status = 'REJECTED',
            reviewed_at = ${now},
            reviewed_by = ${session.email}
          WHERE id = ${paymentId}
            AND status = 'PENDING'
          RETURNING member_id
        ),
        updated_member AS (
          UPDATE member_accounts AS member
          SET
            status = 'REJECTED',
            updated_at = ${now}
          FROM updated_payment
          WHERE member.id = updated_payment.member_id
          RETURNING member.id
        )
        SELECT member_id
        FROM updated_payment
      `;

      const updatedPayment =
        rows[0] as UpdatedPaymentRow | undefined;

      if (!updatedPayment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Pembayaran ini sudah pernah diproses.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        success: true,
        action: "REJECT",
        message:
          "Pembayaran berhasil ditolak.",
      });
    }

    const demoAccountId = randomUUID();

    const rows = await sql`
      WITH updated_payment AS (
        UPDATE member_payments
        SET
          status = 'APPROVED',
          reviewed_at = ${now},
          reviewed_by = ${session.email}
        WHERE id = ${paymentId}
          AND status = 'PENDING'
        RETURNING member_id
      ),
      updated_member AS (
        UPDATE member_accounts AS member
        SET
          status = 'ACTIVE',
          updated_at = ${now}
        FROM updated_payment
        WHERE member.id = updated_payment.member_id
        RETURNING member.id
      ),
      inserted_demo_account AS (
        INSERT INTO demo_accounts (
          id,
          member_id,
          initial_balance,
          balance,
          created_at,
          updated_at
        )
        SELECT
          ${demoAccountId},
          updated_payment.member_id,
          10000000,
          10000000,
          ${now},
          ${now}
        FROM updated_payment
        ON CONFLICT (member_id)
        DO NOTHING
        RETURNING id
      )
      SELECT member_id
      FROM updated_payment
    `;

    const updatedPayment =
      rows[0] as UpdatedPaymentRow | undefined;

    if (!updatedPayment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pembayaran ini sudah pernah diproses.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      action: "APPROVE",
      message:
        "Pembayaran disetujui. Member telah diaktifkan dan Demo Account tersedia.",
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
