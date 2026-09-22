import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createPasswordResetTokenForUser, sendPasswordResetEmail } from "@/lib/verification";
import { passwordResetRequestSchema } from "@/lib/validators";

const genericResponse = {
  success: true,
  message: "If an account exists for that email, we have sent password reset instructions.",
};

export async function POST(request: Request) {
  try {
    const { email } = passwordResetRequestSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!user) return NextResponse.json(genericResponse);

    const token = await createPasswordResetTokenForUser(user.id);
    await sendPasswordResetEmail({ name: user.name, email: user.email, token: token.token });
    return NextResponse.json(genericResponse);
  } catch (error) {
    return apiError(error);
  }
}
