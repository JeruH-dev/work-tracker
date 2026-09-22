import { NextResponse } from "next/server";

import { authStatusByCode, createAuthError, createAuthSuccess } from "@/lib/auth-errors";
import { authenticateUser } from "@/lib/auth";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const result = await authenticateUser(await request.json());

    if (!result.success) {
      return NextResponse.json(createAuthError(result.code, result.message), {
        status: authStatusByCode[result.code],
      });
    }

    const user = result.user;
    if (!user) {
      return NextResponse.json(createAuthError("AUTH_FAILED", "Something went wrong. Please try again."), {
        status: 500,
      });
    }

    await setSession(user.id);
    return NextResponse.json(createAuthSuccess("Signed in successfully.", user), { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(createAuthError("AUTH_FAILED", "Unable to sign in. Please try again."), {
        status: 400,
      });
    }

    return NextResponse.json(createAuthError("AUTH_FAILED", "Something went wrong. Please try again."), {
      status: 500,
    });
  }
}
