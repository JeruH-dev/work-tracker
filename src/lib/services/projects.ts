import { prisma } from "@/lib/db";
import { nextProjectRef } from "@/lib/ids";
import { projectInputSchema, type ProjectInput } from "@/lib/validators";

export async function listProjects() {
  return prisma.project.findMany({ include: { _count: { select: { tasks: true } } }, orderBy: { updatedAt: "desc" } });
}

export async function createProject(input: ProjectInput) {
  const data = projectInputSchema.parse(input);
  return prisma.project.create({ data: { ...data, projectRef: await nextProjectRef() } });
}
