import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await authenticateUser(await request.json());
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    await setSession(user.id);
    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
