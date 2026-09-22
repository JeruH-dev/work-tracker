import { NextResponse } from "next/server";
import { createReminder, listReminders } from "@/lib/services/reminders";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const reminders = await listReminders(user.id, (await params).id);
  return reminders ? NextResponse.json(reminders) : NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const reminder = await createReminder(user.id, (await params).id, await request.json());
    return reminder ? NextResponse.json(reminder, { status: 201 }) : NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
