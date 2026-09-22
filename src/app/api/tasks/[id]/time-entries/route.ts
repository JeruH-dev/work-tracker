import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { createTimeEntry, listTimeEntries } from "@/lib/services/time-entries";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const entries = await listTimeEntries(user.id, (await params).id);
  return entries ? NextResponse.json(entries) : NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const entry = await createTimeEntry(user.id, (await params).id, await request.json());
    return entry ? NextResponse.json(entry, { status: 201 }) : NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
