import { NextResponse } from "next/server";
import { deleteReminder } from "@/lib/services/reminders";
import { requireApiUser, unauthorized } from "@/lib/api";

type Context = { params: Promise<{ id: string; reminderId: string }> };

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const deleted = await deleteReminder(user.id, (await params).id, (await params).reminderId);
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Reminder not found" }, { status: 404 });
}
