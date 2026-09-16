import { prisma } from "@/lib/db";

export async function getDashboardStats(userId: string) {
  const [total, inProgress, blocked, completed, recentTasks] = await Promise.all([
    prisma.task.count({ where: { assigneeId: userId } }),
    prisma.task.count({ where: { assigneeId: userId, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { assigneeId: userId, status: "BLOCKED" } }),
    prisma.task.count({ where: { assigneeId: userId, status: "COMPLETED" } }),
    prisma.task.findMany({ where: { assigneeId: userId }, take: 5, orderBy: { updatedAt: "desc" }, include: { project: true } }),
  ]);
  return { total, inProgress, blocked, completed, recentTasks };
}
