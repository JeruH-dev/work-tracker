import { prisma } from "@/lib/db";
import { timeEntryInputSchema, type TimeEntryInput } from "@/lib/validators";

async function ownedTask(userId: string, taskId: string) {
  return prisma.task.findFirst({ where: { id: taskId, assigneeId: userId }, select: { id: true } });
}

export async function listTimeEntries(userId: string, taskId: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  return prisma.timeEntry.findMany({ where: { taskId }, orderBy: { occurredAt: "desc" } });
}

export async function createTimeEntry(userId: string, taskId: string, input: TimeEntryInput) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const data = timeEntryInputSchema.parse(input);
  return prisma.timeEntry.create({ data: { ...data, taskId } });
}

export async function deleteTimeEntry(userId: string, taskId: string, id: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const existing = await prisma.timeEntry.findFirst({ where: { id, taskId }, select: { id: true } });
  if (!existing) return false;
  await prisma.timeEntry.delete({ where: { id } });
  return true;
}
