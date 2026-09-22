import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { createMilestone, listMilestones } from "@/lib/services/milestones";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const milestones = await listMilestones(user.id, (await params).id);
  return milestones ? NextResponse.json(milestones) : NextResponse.json({ error: "Project not found" }, { status: 404 });
}

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const milestone = await createMilestone(user.id, (await params).id, await request.json());
    return milestone ? NextResponse.json(milestone, { status: 201 }) : NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
