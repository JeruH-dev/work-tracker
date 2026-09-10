import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const [total, inProgress, blocked, completed, recentTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { status: "BLOCKED" } }),
    prisma.task.count({ where: { status: "COMPLETED" } }),
    prisma.task.findMany({ take: 5, orderBy: { updatedAt: "desc" }, include: { project: true } }),
  ]);
  return { total, inProgress, blocked, completed, recentTasks };
}
