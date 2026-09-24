import { ProjectMilestones } from "@/components/ProjectMilestones";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { listMilestones } from "@/lib/services/milestones";
import { listProjects } from "@/lib/services/projects";
import { redirect } from "next/navigation";

type MilestoneRecord = { id: string; title: string; description: string | null; dueDate: Date | null; status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" };

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const projects = await listProjects(user.id);
  const projectsWithMilestones = await Promise.all(projects.map(async (project) => ({
    id: project.id,
    name: project.name,
    workstream: project.workstream,
    status: project.status,
    milestones: (await listMilestones(user.id, project.id) ?? []).map((milestone: MilestoneRecord) => ({
      ...milestone,
      dueDate: milestone.dueDate?.toISOString() ?? null,
    })),
  })));

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Workspace</div>
            <h2>Projects</h2>
            <div className="date-label">Track the outcomes and milestones that move each project forward.</div>
          </div><CreateProjectForm />
        </header>
        <ProjectMilestones projects={projectsWithMilestones} />
      </main>
    </div>
  );
}
