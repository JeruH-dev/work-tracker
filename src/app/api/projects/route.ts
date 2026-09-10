import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/services/projects";

export async function GET() {
  return NextResponse.json(await listProjects());
}

export async function POST(request: Request) {
  try {
    const project = await createProject(await request.json());
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid project" }, { status: 400 });
  }
}
