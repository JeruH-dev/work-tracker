import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { getReportCsv, type ReportPeriod } from "@/lib/services/reports";

function parsePeriod(value: string | null): ReportPeriod {
  return value === "day" || value === "month" ? value : "week";
}

export async function GET(request: Request) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const period = parsePeriod(new URL(request.url).searchParams.get("period"));
    const csv = await getReportCsv(user.id, period);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="work-tracker-${period}-report.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}