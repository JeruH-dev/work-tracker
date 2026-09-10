import { prisma } from "@/lib/db";

export async function nextTaskRef() {
  const latest = await prisma.task.findFirst({ orderBy: { taskRef: "desc" }, select: { taskRef: true } });
  const number = latest ? Number(latest.taskRef.replace("TASK-", "")) + 1 : 1;
  return `TASK-${String(number).padStart(4, "0")}`;
}

export async function nextProjectRef() {
  const latest = await prisma.project.findFirst({ orderBy: { projectRef: "desc" }, select: { projectRef: true } });
  const number = latest ? Number(latest.projectRef.replace("PROJ-", "")) + 1 : 1;
  return `PROJ-${String(number).padStart(4, "0")}`;
}
