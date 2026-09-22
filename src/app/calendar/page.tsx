import { CalendarView } from "@/components/CalendarView";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { listTasks } from "@/lib/services/tasks";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tasks = await listTasks(user.id);
  const serializableTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString() ?? null,
    project: task.project ? { name: task.project.name } : null,
  }));

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Productivity</div>
            <h2>Calendar</h2>
            <div className="date-label">See deadlines in context and make space for what is next.</div>
          </div>
        </header>
        <CalendarView tasks={serializableTasks} />
      </main>
    </div>
  );
}
