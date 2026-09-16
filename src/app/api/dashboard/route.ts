import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard";
import { requireApiUser, unauthorized } from "@/lib/api";

export async function GET() {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  return NextResponse.json(await getDashboardStats(user.id));
}
