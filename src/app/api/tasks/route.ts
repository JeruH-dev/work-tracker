import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/services/tasks";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";

export async function GET() {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  return NextResponse.json(await listTasks(user.id));
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const task = await createTask(user.id, await request.json());
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
