import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Signed session tokens (JWT via `jose`). Shared by the auth Server Actions
 * and `middleware.ts` — jose runs in both the Node and Edge runtimes.
 *
 * The signing secret is a server-only env var (SESSION_SECRET). Never prefix
 * it with NEXT_PUBLIC_ — it must never reach the browser bundle.
 */

export const SESSION_COOKIE = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    // Dev-only fallback so local testing works; production MUST set a strong one.
    return new TextEncoder().encode("dev-only-insecure-secret-change-me-32chars");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token?: string): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
