import { z } from "zod";

import { prisma } from "@/lib/db";

export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  density: z.enum(["comfortable", "compact"]).optional(),
  textSize: z.enum(["small", "default", "large", "extra-large"]).optional(),
  reduceMotion: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  showStatusLabels: z.boolean().optional(),
  largerClickTargets: z.boolean().optional(),
  rememberSidebarState: z.boolean().optional(),
  emailTaskReminders: z.boolean().optional(),
  emailTaskAssignments: z.boolean().optional(),
  emailWeeklySummary: z.boolean().optional(),
  emailProjectUpdates: z.boolean().optional(),
  inAppTaskReminders: z.boolean().optional(),
  inAppDueDateWarnings: z.boolean().optional(),
  reminderTiming: z.enum(["immediately", "one_day", "three_days"]).optional(),
  defaultTaskStatus: z.enum(["BACKLOG", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "COMPLETED"]).optional(),
  defaultPriority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  defaultTaskView: z.enum(["list", "board", "calendar"]).optional(),
  confirmTaskDeletion: z.boolean().optional(),
  showCompletedTasks: z.boolean().optional(),
  warnOverdueTasks: z.boolean().optional(),
  weekStartsOn: z.enum(["sunday", "monday"]).optional(),
  timeFormat: z.enum(["12", "24"]).optional(),
  defaultCalendarView: z.enum(["month", "week", "day"]).optional(),
  showWeekends: z.boolean().optional(),
  showCompletedCalendarTasks: z.boolean().optional(),
  defaultProjectView: z.enum(["overview", "board", "list"]).optional(),
  enableProjectColours: z.boolean().optional(),
  archiveCompletedProjects: z.boolean().optional(),
  showProjectProgress: z.boolean().optional(),
  keepActivityHistory: z.boolean().optional(),
});

export async function getUserSettings(userId: string) {
  return prisma.userSettings.upsert({ where: { userId }, create: { userId }, update: {} });
}

export async function updateUserSettings(userId: string, input: unknown) {
  const data = settingsSchema.parse(input);
  return prisma.userSettings.upsert({ where: { userId }, create: { userId, ...data }, update: data });
}