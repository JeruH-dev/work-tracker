import { NextResponse } from "next/server";
import { createTaskDependency, listTaskDependencies } from "@/lib/services/dependencies";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const dependencies = await listTaskDependencies(user.id, (await params).id);
  return dependencies ? NextResponse.json(dependencies) : NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const dependency = await createTaskDependency(user.id, (await params).id, await request.json());
    return dependency ? NextResponse.json(dependency, { status: 201 }) : NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
