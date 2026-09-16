import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/services/projects";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";

export async function GET() {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  return NextResponse.json(await listProjects(user.id));
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const project = await createProject(user.id, await request.json());
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
