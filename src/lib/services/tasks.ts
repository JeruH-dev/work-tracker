import { prisma } from "@/lib/db";
import { nextTaskRef } from "@/lib/ids";
import { taskInputSchema, type TaskInput } from "@/lib/validators";

export async function listTasks() {
  return prisma.task.findMany({ include: { project: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] });
}

export async function createTask(input: TaskInput) {
  const data = taskInputSchema.parse(input);
  return prisma.task.create({ data: { ...data, taskRef: await nextTaskRef() } });
}
