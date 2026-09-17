import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 });
  if (error instanceof Error && error.message === "Project not found") return NextResponse.json({ error: error.message }, { status: 404 });
  if (
    error instanceof Error &&
    (error.name === "PrismaClientKnownRequestError" ||
      error.name === "PrismaClientInitializationError" ||
      error.name === "PrismaClientRustPanicError" ||
      /P1000|P1001|ECONNREFUSED|authentication failed/i.test(error.message))
  ) {
    return NextResponse.json({ error: "The database is unavailable. Start PostgreSQL, then try again." }, { status: 503 });
  }
  console.error(error);
  return NextResponse.json({ error: "Unable to process the request" }, { status: 500 });
}

export const unauthorized = () => NextResponse.json({ error: "Authentication required" }, { status: 401 });
