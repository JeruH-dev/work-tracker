import { Sidebar } from "@/components/Sidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { getCurrentUser } from "@/lib/auth";
import { listTasks } from "@/lib/services/tasks";
import { redirect } from "next/navigation";

export default async function KanbanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tasks = await listTasks(user.id);
  const serializableTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
  }));

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Productivity</div>
            <h2>Task board</h2>
            <div className="date-label">Move work forward by keeping each task in its current stage.</div>
          </div>
        </header>
        <KanbanBoard tasks={serializableTasks} />
      </main>
    </div>
  );
}
