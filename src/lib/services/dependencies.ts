import { prisma } from "@/lib/db";
import { validateTaskDependency } from "@/lib/dependencies";
import { taskDependencyInputSchema, type TaskDependencyInput } from "@/lib/validators";

async function ownedTask(userId: string, taskId: string) {
  return prisma.task.findFirst({ where: { id: taskId, assigneeId: userId }, select: { id: true } });
}

export async function listTaskDependencies(userId: string, taskId: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  return prisma.taskDependency.findMany({
    where: { taskId },
    include: { dependencyTask: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createTaskDependency(userId: string, taskId: string, input: TaskDependencyInput) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const data = taskDependencyInputSchema.parse(input);

  validateTaskDependency(taskId, data.dependencyTaskId);

  const dependency = await prisma.task.findFirst({ where: { id: data.dependencyTaskId, assigneeId: userId }, select: { id: true } });
  if (!dependency) throw new Error("Task not found");

  return prisma.taskDependency.create({
    data: { taskId, dependencyTaskId: data.dependencyTaskId },
    include: { dependencyTask: true },
  });
}

export async function deleteTaskDependency(userId: string, taskId: string, id: string) {
  const task = await ownedTask(userId, taskId);
  if (!task) return null;
  const existing = await prisma.taskDependency.findFirst({ where: { id, taskId }, select: { id: true } });
  if (!existing) return false;
  await prisma.taskDependency.delete({ where: { id } });
  return true;
}
