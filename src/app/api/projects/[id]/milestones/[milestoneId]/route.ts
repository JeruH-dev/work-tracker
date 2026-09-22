import { NextResponse } from "next/server";
import { apiError, requireApiUser, unauthorized } from "@/lib/api";
import { deleteMilestone, updateMilestone } from "@/lib/services/milestones";

type Context = { params: Promise<{ id: string; milestoneId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireApiUser();
    if (!user) return unauthorized();
    const { id, milestoneId } = await params;
    const milestone = await updateMilestone(user.id, id, milestoneId, await request.json());
    if (milestone === null) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return milestone ? NextResponse.json(milestone) : NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const { id, milestoneId } = await params;
  const deleted = await deleteMilestone(user.id, id, milestoneId);
  if (deleted === null) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Milestone not found" }, { status: 404 });
}
