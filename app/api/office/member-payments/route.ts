import { NextResponse } from "next/server";

import db from "@/lib/db/database";
import { getOfficeSession } from "@/lib/office/session";

type MemberPaymentRow = {
  id: string;
  member_id: string;
  name: string;
  email: string;
  member_status: string;
  amount: number;
  payment_method: string;
  proof_path: string | null;
  payment_status: string;
  submitted_at: number | null;
  reviewed_at: number | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
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
    const payments = db
      .prepare(
        `
          SELECT
            p.id,
            p.member_id,
            m.name,
            m.email,
            m.status AS member_status,
            p.amount,
            p.payment_method,
            p.proof_path,
            p.status AS payment_status,
            p.submitted_at,
            p.reviewed_at,
            p.reviewed_by,
            p.rejection_reason
          FROM member_payments p
          INNER JOIN member_accounts m
            ON m.id = p.member_id
          ORDER BY
            CASE
              WHEN p.status = 'PENDING' THEN 0
              ELSE 1
            END,
            p.submitted_at DESC
        `,
      )
      .all() as MemberPaymentRow[];

    const pendingCount = payments.filter(
      (payment) =>
        payment.payment_status === "PENDING",
    ).length;

    const approvedCount = payments.filter(
      (payment) =>
        payment.payment_status === "APPROVED",
    ).length;

    const rejectedCount = payments.filter(
      (payment) =>
        payment.payment_status === "REJECTED",
    ).length;

    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
      },
      data: {
        payments,
        counts: {
          total: payments.length,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        },
      },
    });
  } catch (error) {
    console.error(
      "Office Member Payments API Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Data pembayaran Member belum dapat dibaca.",
      },
      { status: 500 },
    );
  }
}
