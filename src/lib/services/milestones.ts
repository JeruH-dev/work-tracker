import { prisma } from "@/lib/db";
import { milestoneInputSchema, type MilestoneInput } from "@/lib/validators";

async function ownedProject(userId: string, projectId: string) {
  return prisma.project.findFirst({ where: { id: projectId, ownerId: userId }, select: { id: true } });
}

export async function listMilestones(userId: string, projectId: string) {
  const project = await ownedProject(userId, projectId);
  if (!project) return null;
  return prisma.milestone.findMany({ where: { projectId }, orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }] });
}

export async function createMilestone(userId: string, projectId: string, input: MilestoneInput) {
  const project = await ownedProject(userId, projectId);
  if (!project) return null;
  const data = milestoneInputSchema.parse(input);
  return prisma.milestone.create({ data: { ...data, projectId } });
}

export async function updateMilestone(userId: string, projectId: string, id: string, input: MilestoneInput) {
  const project = await ownedProject(userId, projectId);
  if (!project) return null;
  const existing = await prisma.milestone.findFirst({ where: { id, projectId } });
  if (!existing) return undefined;
  const data = milestoneInputSchema.parse(input);
  return prisma.milestone.update({ where: { id }, data });
}

export async function deleteMilestone(userId: string, projectId: string, id: string) {
  const project = await ownedProject(userId, projectId);
  if (!project) return null;
  const existing = await prisma.milestone.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!existing) return false;
  await prisma.milestone.delete({ where: { id } });
  return true;
}
