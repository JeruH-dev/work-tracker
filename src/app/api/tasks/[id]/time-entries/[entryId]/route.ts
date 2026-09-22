import { NextResponse } from "next/server";
import { requireApiUser, unauthorized } from "@/lib/api";
import { deleteTimeEntry } from "@/lib/services/time-entries";

type Context = { params: Promise<{ id: string; entryId: string }> };

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const { id, entryId } = await params;
  const deleted = await deleteTimeEntry(user.id, id, entryId);
  if (deleted === null) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Time entry not found" }, { status: 404 });
}
