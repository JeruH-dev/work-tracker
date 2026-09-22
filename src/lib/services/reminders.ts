import { prisma } from "@/lib/db";
import { reminderInputSchema, type ReminderInput } from "@/lib/validators";

async function ownedTask(userId: string, taskId: string) {
  return prisma.task.findFirst({ where: { id: taskId, assigneeId: userId }, select: { id: true } });
}

export async function listReminders(userId: string, taskId: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  return prisma.reminder.findMany({ where: { taskId }, orderBy: { scheduledFor: "asc" } });
}

export async function createReminder(userId: string, taskId: string, input: ReminderInput) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const data = reminderInputSchema.parse(input);
  return prisma.reminder.create({ data: { ...data, taskId } });
}

export async function deleteReminder(userId: string, taskId: string, id: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const existing = await prisma.reminder.findFirst({ where: { id, taskId }, select: { id: true } });
  if (!existing) return false;
  await prisma.reminder.delete({ where: { id } });
  return true;
}
