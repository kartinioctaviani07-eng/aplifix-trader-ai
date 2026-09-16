import { NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import { sql } from "@/lib/db/postgres";

type PartnershipRequest = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
};

function clean(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as PartnershipRequest;

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const interest = clean(body.interest);
    const message = clean(body.message);

    if (!name || !email || !interest) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama, email, dan jenis minat kerja sama wajib diisi.",
        },
        { status: 400 },
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email belum benar.",
        },
        { status: 400 },
      );
    }

    const id = randomUUID();
    const timestamp = Date.now();

    await sql`
      INSERT INTO partnership_interests (
        id,
        name,
        email,
        phone,
        interest,
        message,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${id},
        ${name},
        ${email},
        ${phone},
        ${interest},
        ${message},
        'NEW',
        ${timestamp},
        ${timestamp}
      )
    `;

    return NextResponse.json({
      success: true,
      message:
        "Minat kerja sama Anda sudah tercatat. Tim APLIFIX dapat meninjau data tersebut untuk proses berikutnya.",
      reference: id,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Minat kerja sama belum dapat disimpan. Silakan coba lagi.",
      },
      { status: 500 },
    );
  }
}
