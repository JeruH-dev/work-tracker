import { Sidebar } from "@/components/Sidebar";
import { TaskTimeLog } from "@/components/TaskTimeLog";
import { getCurrentUser } from "@/lib/auth";
import { listTaskDependencies } from "@/lib/services/dependencies";
import { listReminders } from "@/lib/services/reminders";
import { listTimeEntries } from "@/lib/services/time-entries";
import { listTasks } from "@/lib/services/tasks";
import { redirect } from "next/navigation";

type TimeEntryRecord = { id: string; durationMinutes: number; note: string | null; occurredAt: Date; createdAt: Date };

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tasks = await listTasks(user.id);
  const tasksWithTime = await Promise.all(tasks.map(async (task) => {
    const [dependencies, reminders] = await Promise.all([listTaskDependencies(user.id, task.id), listReminders(user.id, task.id)]);
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      project: task.project ? { name: task.project.name } : null,
      recurrenceRule: task.recurrenceRule,
      recurrenceEndDate: task.recurrenceEndDate ? task.recurrenceEndDate.toISOString() : null,
      dependencies: (dependencies ?? []).map(({ id, dependencyTask }) => ({ id, dependencyTask: { id: dependencyTask.id, title: dependencyTask.title } })),
      reminders: (reminders ?? []).map((reminder) => ({
        id: reminder.id,
        message: reminder.message,
        scheduledFor: reminder.scheduledFor.toISOString(),
      })),
      timeEntries: ((await listTimeEntries(user.id, task.id) ?? []) as TimeEntryRecord[]).map((entry) => ({
        ...entry,
        occurredAt: entry.occurredAt.toISOString(),
      })),
    };
  }));

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Workspace</div>
            <h2>My tasks</h2>
            <div className="date-label">Keep a practical record of the time behind the work.</div>
          </div>
        </header>
        <TaskTimeLog tasks={tasksWithTime} />
      </main>
    </div>
  );
}
