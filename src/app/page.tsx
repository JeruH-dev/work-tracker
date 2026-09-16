import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { NewTaskForm } from "@/components/NewTaskForm";
import { SignOutButton } from "@/components/SignOutButton";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/services/dashboard";
import { listProjects } from "@/lib/services/projects";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const [stats, projects] = await Promise.all([getDashboardStats(user.id), listProjects(user.id)]);
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return <div className="dashboard-shell"><Sidebar /><main className="main-content">
    <header className="topbar"><div><div className="eyebrow">Work Tracker</div><h2>Good morning, {user.name.split(" ")[0]}</h2><div className="date-label">Here is the shape of your work today.</div></div><div className="user-chip"><div className="avatar">{initials}</div><span>{user.name}</span><SignOutButton /><NewTaskForm projects={projects.map(({ id, name }) => ({ id, name }))} /></div></header>
    <section className="stats-grid" aria-label="Work summary">
      <div className="stat-card"><div className="stat-label">Open tasks</div><div className="stat-value">{stats.total - stats.completed}</div><div className="stat-note">Across {projects.length} projects</div></div>
      <div className="stat-card"><div className="stat-label">In progress</div><div className="stat-value">{stats.inProgress}</div><div className="stat-note">Keep the momentum</div></div>
      <div className="stat-card"><div className="stat-label">Blocked</div><div className="stat-value">{stats.blocked}</div><div className="stat-note" style={{ color: "var(--red)" }}>Needs attention</div></div>
      <div className="stat-card"><div className="stat-label">Completed this month</div><div className="stat-value">{stats.completed}</div><div className="stat-note">+18% from last month</div></div>
    </section>
    <div className="dashboard-grid"><div className="panel"><div className="panel-heading"><div className="panel-title">Recent work</div></div><TaskList tasks={stats.recentTasks} /></div>
      <div className="panel"><div className="panel-heading"><div className="panel-title">Your projects</div><span className="date-label">{projects.length} total</span></div>{projects.length ? projects.map((project) => <div className="project-row" key={project.id}><div><div className="task-name">{project.name}</div><div className="task-meta">{project.workstream.replaceAll("_", " ")}</div></div><span className="task-status status-progress">{project._count.tasks} tasks</span></div>) : <p className="empty-state">Create a project through the API, then assign tasks to it.</p>}</div>
    </div>
  </main></div>;
}
