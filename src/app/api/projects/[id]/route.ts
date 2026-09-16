import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { deleteProject, getProject, updateProject } from "@/lib/services/projects";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const project = await getProject(user.id, (await params).id);
  return project ? NextResponse.json(project) : NextResponse.json({ error: "Project not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const project = await updateProject(user.id, (await params).id, await request.json());
    return project ? NextResponse.json(project) : NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const deleted = await deleteProject(user.id, (await params).id);
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Project not found" }, { status: 404 });
}
