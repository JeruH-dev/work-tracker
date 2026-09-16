import { prisma } from "@/lib/db";
import { nextTaskRef } from "@/lib/ids";
import { taskInputSchema, type TaskInput } from "@/lib/validators";

export async function listTasks(userId: string) {
  return prisma.task.findMany({
    where: { assigneeId: userId },
    include: { project: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function createTask(userId: string, input: TaskInput) {
  const data = taskInputSchema.parse(input);
  if (data.projectId) {
    const project = await prisma.project.findFirst({ where: { id: data.projectId, ownerId: userId }, select: { id: true } });
    if (!project) throw new Error("Project not found");
  }
  return prisma.task.create({ data: { ...data, taskRef: await nextTaskRef(), assigneeId: userId } });
}

export async function getTask(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, assigneeId: userId }, include: { project: true } });
}

export async function updateTask(userId: string, id: string, input: TaskInput) {
  const existing = await getTask(userId, id);
  if (!existing) return null;
  const data = taskInputSchema.parse(input);
  if (data.projectId) {
    const project = await prisma.project.findFirst({ where: { id: data.projectId, ownerId: userId }, select: { id: true } });
    if (!project) throw new Error("Project not found");
  }
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(userId: string, id: string) {
  const existing = await getTask(userId, id);
  if (!existing) return false;
  await prisma.task.delete({ where: { id } });
  return true;
}
