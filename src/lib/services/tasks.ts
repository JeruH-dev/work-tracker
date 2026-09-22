import { prisma } from "@/lib/db";
import { nextTaskRef } from "@/lib/ids";
import { normalizeTaskPayload } from "@/lib/recurrence";
import { taskInputSchema, type TaskInput } from "@/lib/validators";

export async function listTasks(userId: string) {
  return prisma.task.findMany({
    where: { assigneeId: userId },
    include: { project: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function createTask(userId: string, input: TaskInput) {
  const data = taskInputSchema.parse(normalizeTaskPayload(input as Record<string, unknown>));
  if (data.projectId) {
    const project = await prisma.project.findFirst({ where: { id: data.projectId, ownerId: userId }, select: { id: true } });
    if (!project) throw new Error("Project not found");
  }
  return prisma.task.create({ data: { ...data, recurrenceRule: data.recurrenceRule ?? "NONE", taskRef: await nextTaskRef(), assigneeId: userId } });
}

export async function getTask(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, assigneeId: userId }, include: { project: true } });
}

export async function updateTask(userId: string, id: string, input: TaskInput) {
  const existing = await getTask(userId, id);
  if (!existing) return null;
  const data = taskInputSchema.parse(normalizeTaskPayload(input as Record<string, unknown>));
  if (data.projectId) {
    const project = await prisma.project.findFirst({ where: { id: data.projectId, ownerId: userId }, select: { id: true } });
    if (!project) throw new Error("Project not found");
  }
  const task = await prisma.task.update({ where: { id }, data });
  if (data.status === "COMPLETED" && existing.status !== "COMPLETED" && existing.recurrenceRule !== "NONE" && existing.dueDate) {
    const nextDueDate = nextRecurringDate(existing.dueDate, existing.recurrenceRule);
    if (!existing.recurrenceEndDate || nextDueDate <= existing.recurrenceEndDate) {
      await prisma.task.create({ data: { title: existing.title, description: existing.description, priority: existing.priority, status: "BACKLOG", dueDate: nextDueDate, outcome: null, nextAction: existing.nextAction, blocker: null, projectId: existing.projectId, recurrenceRule: existing.recurrenceRule, recurrenceEndDate: existing.recurrenceEndDate, taskRef: await nextTaskRef(), assigneeId: userId } });
    }
  }
  return task;
}

function nextRecurringDate(dueDate: Date, rule: "DAILY" | "WEEKLY" | "MONTHLY") {
  const nextDate = new Date(dueDate);
  if (rule === "DAILY") nextDate.setDate(nextDate.getDate() + 1);
  if (rule === "WEEKLY") nextDate.setDate(nextDate.getDate() + 7);
  if (rule === "MONTHLY") nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate;
}

export async function deleteTask(userId: string, id: string) {
  const existing = await getTask(userId, id);
  if (!existing) return false;
  await prisma.task.delete({ where: { id } });
  return true;
}
