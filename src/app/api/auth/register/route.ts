import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await registerUser(await request.json());
    await setSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) return NextResponse.json({ error: error.message }, { status: 409 });
    return apiError(error);
  }
}
