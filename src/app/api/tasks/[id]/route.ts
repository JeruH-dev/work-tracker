import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { deleteTask, getTask, updateTask } from "@/lib/services/tasks";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const task = await getTask(user.id, (await params).id);
  return task ? NextResponse.json(task) : NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const task = await updateTask(user.id, (await params).id, await request.json());
    return task ? NextResponse.json(task) : NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const deleted = await deleteTask(user.id, (await params).id);
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Task not found" }, { status: 404 });
}
