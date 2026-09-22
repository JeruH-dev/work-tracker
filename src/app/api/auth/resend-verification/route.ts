import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { resendVerificationEmail } from "@/lib/verification";
import { z } from "zod";

const resendVerificationSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export async function POST(request: Request) {
  try {
    const data = resendVerificationSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, name: true, email: true, emailVerified: true },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Verification email has been sent.",
      });
    }

    await resendVerificationEmail(user);

    return NextResponse.json({
      success: true,
      message: "Verification email has been sent.",
    });
  } catch (error) {
    return apiError(error);
  }
}
