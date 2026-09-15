import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "aplifix_office_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

type OfficeSession = {
  email: string;
  expiresAt: number;
};

function getSecret(): string {
  const secret = process.env.OFFICE_SESSION_SECRET;

  if (!secret) {
    throw new Error("OFFICE_SESSION_SECRET belum dikonfigurasi.");
  }

  return secret;
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

function createToken(session: OfficeSession): string {
  const payload = encode(JSON.stringify(session));
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

function verifyToken(token: string): OfficeSession | null {
  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const payload = token.slice(0, separatorIndex);
  const receivedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = sign(payload);

  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const session = JSON.parse(decode(payload)) as OfficeSession;

    if (
      typeof session.email !== "string" ||
      typeof session.expiresAt !== "number"
    ) {
      return null;
    }

    if (Date.now() >= session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function createOfficeSession(
  email: string,
): Promise<void> {
  const session: OfficeSession = {
    email,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: createToken(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getOfficeSession(): Promise<OfficeSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function clearOfficeSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function requireOfficeSession(): Promise<OfficeSession> {
  const session = await getOfficeSession();

  if (!session) {
    throw new Error("OFFICE_UNAUTHORIZED");
  }

  return session;
}
