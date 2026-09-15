import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(password, salt, KEY_LENGTH);

  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(
  password: string,
  storedHash: string,
): boolean {
  const [saltHex, hashHex] = storedHash.split(":");

  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const storedKey = Buffer.from(hashHex, "hex");

  if (storedKey.length !== KEY_LENGTH) {
    return false;
  }

  const derivedKey = scryptSync(
    password,
    salt,
    KEY_LENGTH,
  );

  return timingSafeEqual(storedKey, derivedKey);
}
