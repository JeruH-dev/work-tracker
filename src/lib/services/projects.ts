import { prisma } from "@/lib/db";
import { nextProjectRef } from "@/lib/ids";
import { projectInputSchema, type ProjectInput } from "@/lib/validators";

export async function listProjects(userId: string) {
  return prisma.project.findMany({ where: { ownerId: userId }, include: { _count: { select: { tasks: true } } }, orderBy: { updatedAt: "desc" } });
}

export async function createProject(userId: string, input: ProjectInput) {
  const data = projectInputSchema.parse(input);
  return prisma.project.create({ data: { ...data, projectRef: await nextProjectRef(), ownerId: userId } });
}

export async function getProject(userId: string, id: string) {
  return prisma.project.findFirst({ where: { id, ownerId: userId }, include: { _count: { select: { tasks: true } } } });
}

export async function updateProject(userId: string, id: string, input: ProjectInput) {
  const existing = await getProject(userId, id);
  if (!existing) return null;
  const data = projectInputSchema.parse(input);
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(userId: string, id: string) {
  const existing = await getProject(userId, id);
  if (!existing) return false;
  await prisma.project.delete({ where: { id } });
  return true;
}
