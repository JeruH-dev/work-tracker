import { prisma } from "@/lib/db";

function startOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export type ReportPeriod = "day" | "week" | "month";

export async function getWorkReport(userId: string, period: ReportPeriod = "week", now = new Date()) {
  const periodEnd = startOfDay(now);
  const periodStart = new Date(periodEnd);
  if (period === "day") {
    periodStart.setDate(periodStart.getDate());
  } else if (period === "month") {
    periodStart.setDate(1);
  } else {
    periodStart.setDate(periodStart.getDate() - 6);
  }
  const nextDay = new Date(periodEnd);
  nextDay.setDate(nextDay.getDate() + 1);
  const previousEnd = new Date(periodStart);
  const previousStart = new Date(previousEnd);
  if (period === "day") {
    previousStart.setDate(previousStart.getDate() - 1);
  } else if (period === "month") {
    previousStart.setMonth(previousStart.getMonth() - 1);
  } else {
    previousStart.setDate(previousStart.getDate() - 7);
  }

  const [tasks, completedTasks, activities, timeEntries, projects, previousCompletedTasks, previousActivities, previousTimeEntries, previousOverdueTasks] = await Promise.all([
    prisma.task.findMany({
      where: { assigneeId: userId },
      select: { id: true, title: true, status: true, dueDate: true, project: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.task.findMany({
      where: { assigneeId: userId, status: "COMPLETED", updatedAt: { gte: periodStart, lt: nextDay } },
      select: { id: true, title: true, updatedAt: true, project: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.activity.findMany({
      where: { authorId: userId, occurredAt: { gte: periodStart, lt: nextDay } },
      select: { id: true, note: true, occurredAt: true, task: { select: { title: true } } },
      orderBy: { occurredAt: "desc" },
      take: 8,
    }),
    prisma.timeEntry.aggregate({
      where: { task: { assigneeId: userId }, occurredAt: { gte: periodStart, lt: nextDay } },
      _sum: { durationMinutes: true },
    }),
    prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true, status: true, workstream: true, _count: { select: { tasks: true } }, tasks: { select: { status: true, dueDate: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.task.count({ where: { assigneeId: userId, status: "COMPLETED", updatedAt: { gte: previousStart, lt: previousEnd } } }),
    prisma.activity.count({ where: { authorId: userId, occurredAt: { gte: previousStart, lt: previousEnd } } }),
    prisma.timeEntry.aggregate({
      where: { task: { assigneeId: userId }, occurredAt: { gte: previousStart, lt: previousEnd } },
      _sum: { durationMinutes: true },
    }),
    prisma.task.count({ where: { assigneeId: userId, status: { not: "COMPLETED" }, dueDate: { lt: previousEnd } } }),
  ]);

  const statusCounts = tasks.reduce<Record<string, number>>((counts, task) => {
    counts[task.status] = (counts[task.status] ?? 0) + 1;
    return counts;
  }, {});
  const openTasks = tasks.filter((task) => task.status !== "COMPLETED").length;
  const overdueTasks = tasks.filter((task) => task.status !== "COMPLETED" && task.dueDate && task.dueDate < periodEnd).length;
  const workstreams = projects.reduce<Record<string, { taskCount: number; completedTasks: number; blockedTasks: number }>>((summary, project) => {
    const entry = summary[project.workstream] ?? { taskCount: 0, completedTasks: 0, blockedTasks: 0 };
    entry.taskCount += project._count.tasks;
    entry.completedTasks += project.tasks.filter((task) => task.status === "COMPLETED").length;
    entry.blockedTasks += project.tasks.filter((task) => task.status === "BLOCKED").length;
    summary[project.workstream] = entry;
    return summary;
  }, {});

  return {
    periodStart,
    periodEnd,
    totals: {
      totalTasks: tasks.length,
      openTasks,
      completedTasks: completedTasks.length,
      overdueTasks,
      activityCount: activities.length,
      trackedMinutes: timeEntries._sum.durationMinutes ?? 0,
      completionRate: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    },
    comparison: {
      previousCompletedTasks,
      previousActivities,
      previousTrackedMinutes: previousTimeEntries._sum.durationMinutes ?? 0,
      previousOverdueTasks,
      completedTasksDelta: completedTasks.length - previousCompletedTasks,
      activityCountDelta: activities.length - previousActivities,
      trackedMinutesDelta: (timeEntries._sum.durationMinutes ?? 0) - (previousTimeEntries._sum.durationMinutes ?? 0),
      overdueTasksDelta: overdueTasks - previousOverdueTasks,
      completionRateDelta: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) - Math.round((previousCompletedTasks / tasks.length) * 100) : 0,
    },
    statusCounts,
    workstreams,
    completedTasks,
    activities,
    projects: projects.map((project) => ({
      ...project,
      completedTasks: project.tasks.filter((task) => task.status === "COMPLETED").length,
      blockedTasks: project.tasks.filter((task) => task.status === "BLOCKED").length,
      overdueTasks: project.tasks.filter((task) => task.status !== "COMPLETED" && task.dueDate && task.dueDate < periodEnd).length,
      completionRate: project._count.tasks ? Math.round((project.tasks.filter((task) => task.status === "COMPLETED").length / project._count.tasks) * 100) : 0,
    })),
  };
}

export async function getWeeklyReport(userId: string, now = new Date()) {
  return getWorkReport(userId, "week", now);
}