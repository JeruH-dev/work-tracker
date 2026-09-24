import { NextResponse } from "next/server";

import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { getUserSettings, updateUserSettings } from "@/lib/settings";

export async function GET() {
  const user = await requireApiUser();
  if (!user) return unauthorized();

  try {
    return NextResponse.json(await getUserSettings(user.id));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  const user = await requireApiUser();
  if (!user) return unauthorized();

  try {
    return NextResponse.json(await updateUserSettings(user.id, await request.json()));
  } catch (error) {
    return apiError(error);
  }
}