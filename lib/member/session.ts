import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "aplifix_member_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  memberId: string;
  expiresAt: number;
};

function getSecret(): string {
  const secret = process.env.MEMBER_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "MEMBER_SESSION_SECRET belum dikonfigurasi.",
    );
  }

  return secret;
}

function sign(payload: string): string {
  return createHmac(
    "sha256",
    getSecret(),
  )
    .update(payload)
    .digest("hex");
}

function encodeSession(
  memberId: string,
): string {
  const payload: SessionPayload = {
    memberId,
    expiresAt:
      Date.now() + SESSION_MAX_AGE * 1000,
  };

  const encoded = Buffer.from(
    JSON.stringify(payload),
  ).toString("base64url");

  const signature = sign(encoded);

  return `${encoded}.${signature}`;
}

function decodeSession(
  value: string,
): SessionPayload | null {
  const [encoded, signature] = value.split(".");

  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = sign(encoded);

  const providedBuffer = Buffer.from(
    signature,
    "hex",
  );

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "hex",
  );

  if (
    providedBuffer.length !==
    expectedBuffer.length
  ) {
    return null;
  }

  if (
    !timingSafeEqual(
      providedBuffer,
      expectedBuffer,
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(
        encoded,
        "base64url",
      ).toString("utf8"),
    ) as SessionPayload;

    if (
      !payload.memberId ||
      !payload.expiresAt ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createMemberSession(
  memberId: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    encodeSession(memberId),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  );
}

export async function getMemberSession(): Promise<
  SessionPayload | null
> {
  const cookieStore = await cookies();
  const value = cookieStore.get(
    COOKIE_NAME,
  )?.value;

  if (!value) {
    return null;
  }

  return decodeSession(value);
}

export async function clearMemberSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  );
}
