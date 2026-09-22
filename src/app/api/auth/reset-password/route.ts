import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { hashPassword } from "@/lib/passwords";
import { resetPasswordWithToken } from "@/lib/verification";
import { passwordResetSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const data = passwordResetSchema.parse(await request.json());
    const result = await resetPasswordWithToken(data.token, await hashPassword(data.password));

    if (result === "invalid") {
      return NextResponse.json({ success: false, code: "RESET_TOKEN_INVALID", message: "This password reset link is invalid." }, { status: 400 });
    }
    if (result === "expired") {
      return NextResponse.json({ success: false, code: "RESET_TOKEN_EXPIRED", message: "This password reset link has expired." }, { status: 410 });
    }

    return NextResponse.json({ success: true, message: "Your password has been reset. You can now sign in." });
  } catch (error) {
    return apiError(error);
  }
}
