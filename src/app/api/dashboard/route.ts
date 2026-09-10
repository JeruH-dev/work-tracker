import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard";

export async function GET() {
  return NextResponse.json(await getDashboardStats());
}
