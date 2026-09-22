import { NextResponse } from "next/server";

import { apiError } from "@/lib/api";
import { verifyEmailToken } from "@/lib/verification";
import { z } from "zod";

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = verifyEmailSchema.parse(await request.json());
    const result = await verifyEmailToken(data.token);

    if (!result) {
      return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
    }

    if (result.expired) {
      return NextResponse.json({ error: "This verification link has expired." }, { status: 410 });
    }

    return NextResponse.json({ message: "Your email address has been verified." });
  } catch (error) {
    return apiError(error);
  }
}
