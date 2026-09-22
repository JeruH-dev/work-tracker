import { NextResponse } from "next/server";

import { AuthServiceError, authStatusByCode, createAuthError, createAuthSuccess } from "@/lib/auth-errors";
import { registerUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await registerUser(await request.json());
    return NextResponse.json(createAuthSuccess("Account created successfully. Please verify your email to continue.", user), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return NextResponse.json(createAuthError(error.code, error.message), {
        status: authStatusByCode[error.code],
      });
    }

    return NextResponse.json(
      createAuthError("REGISTRATION_FAILED", "Unable to create your account. Please try again."),
      { status: 500 },
    );
  }
}
