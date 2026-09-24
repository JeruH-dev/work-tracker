-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "density" TEXT NOT NULL DEFAULT 'comfortable',
    "textSize" TEXT NOT NULL DEFAULT 'default',
    "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
    "highContrast" BOOLEAN NOT NULL DEFAULT false,
    "showStatusLabels" BOOLEAN NOT NULL DEFAULT false,
    "largerClickTargets" BOOLEAN NOT NULL DEFAULT false,
    "rememberSidebarState" BOOLEAN NOT NULL DEFAULT true,
    "emailTaskReminders" BOOLEAN NOT NULL DEFAULT true,
    "emailTaskAssignments" BOOLEAN NOT NULL DEFAULT true,
    "emailWeeklySummary" BOOLEAN NOT NULL DEFAULT false,
    "emailProjectUpdates" BOOLEAN NOT NULL DEFAULT false,
    "inAppTaskReminders" BOOLEAN NOT NULL DEFAULT true,
    "inAppDueDateWarnings" BOOLEAN NOT NULL DEFAULT true,
    "reminderTiming" TEXT NOT NULL DEFAULT 'one_day',
    "defaultTaskStatus" TEXT NOT NULL DEFAULT 'BACKLOG',
    "defaultPriority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "defaultTaskView" TEXT NOT NULL DEFAULT 'list',
    "confirmTaskDeletion" BOOLEAN NOT NULL DEFAULT true,
    "showCompletedTasks" BOOLEAN NOT NULL DEFAULT true,
    "warnOverdueTasks" BOOLEAN NOT NULL DEFAULT true,
    "weekStartsOn" TEXT NOT NULL DEFAULT 'monday',
    "timeFormat" TEXT NOT NULL DEFAULT '12',
    "defaultCalendarView" TEXT NOT NULL DEFAULT 'month',
    "showWeekends" BOOLEAN NOT NULL DEFAULT true,
    "showCompletedCalendarTasks" BOOLEAN NOT NULL DEFAULT true,
    "defaultProjectView" TEXT NOT NULL DEFAULT 'overview',
    "enableProjectColours" BOOLEAN NOT NULL DEFAULT true,
    "archiveCompletedProjects" BOOLEAN NOT NULL DEFAULT true,
    "showProjectProgress" BOOLEAN NOT NULL DEFAULT true,
    "keepActivityHistory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
