import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const sessionCookieName = "work_tracker_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

type SessionPayload = { sub: string; exp: number };

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return secret;
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function createSessionToken(userId: string) {
  const payload = encode(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds }));
  return `${payload}.${sign(payload)}`;
}

function readSessionToken(token: string): SessionPayload | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expectedSignature = sign(payload);
  const given = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    return typeof parsed.sub === "string" && parsed.exp > Math.floor(Date.now() / 1000) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getSessionUserId() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return token ? readSessionToken(token)?.sub ?? null : null;
}

export async function setSession(userId: string) {
  (await cookies()).set(sessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    maxAge: sessionLifetimeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  (await cookies()).delete(sessionCookieName);
}
