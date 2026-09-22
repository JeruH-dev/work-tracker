import { NextResponse } from "next/server";
import { deleteTaskDependency } from "@/lib/services/dependencies";
import { requireApiUser, unauthorized } from "@/lib/api";

type Context = { params: Promise<{ id: string; dependencyId: string }> };

export async function DELETE(_: Request, { params }: Context) {
  const user = await requireApiUser();
  if (!user) return unauthorized();
  const deleted = await deleteTaskDependency(user.id, (await params).id, (await params).dependencyId);
  return deleted ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Dependency not found" }, { status: 404 });
}
