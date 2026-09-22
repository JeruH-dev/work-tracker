"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type MilestoneStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";
type Milestone = { id: string; title: string; description: string | null; dueDate: string | null; status: MilestoneStatus };
type Project = { id: string; name: string; workstream: string; status: string; milestones: Milestone[] };

const statusLabels: Record<MilestoneStatus, string> = { PLANNED: "Planned", IN_PROGRESS: "In progress", COMPLETED: "Completed" };

export function ProjectMilestones({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [submittingProjectId, setSubmittingProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createMilestone(projectId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmittingProjectId(projectId);
    const form = new FormData(event.currentTarget);
    const data = { title: form.get("title"), dueDate: form.get("dueDate") || undefined, status: "PLANNED" };
    const response = await fetch(`/api/projects/${projectId}/milestones`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const payload = await response.json().catch(() => ({}));
    setSubmittingProjectId(null);
    if (!response.ok) return setError(payload.error ?? "Unable to create milestone");
    event.currentTarget.reset();
    router.refresh();
  }

  async function updateStatus(projectId: string, milestone: Milestone, status: MilestoneStatus) {
    const response = await fetch(`/api/projects/${projectId}/milestones/${milestone.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: milestone.title, description: milestone.description ?? undefined, dueDate: milestone.dueDate ?? undefined, status }) });
    if (!response.ok) setError("Unable to update milestone");
    else router.refresh();
  }

  if (!projects.length) return <p className="empty-state">No projects yet. Create a project through the API to start tracking milestones.</p>;

  return <section className="projects-list" aria-label="Projects and milestones">{error && <p className="form-error" role="alert">{error}</p>}{projects.map((project) => <article className="project-panel" key={project.id}><div className="project-panel-heading"><div><h3>{project.name}</h3><div className="task-meta">{project.workstream.replaceAll("_", " ")}</div></div><span className="task-status status-progress">{project.status.replaceAll("_", " ")}</span></div><div className="milestone-list">{project.milestones.length ? project.milestones.map((milestone) => <div className="milestone-row" key={milestone.id}><div><div className="task-name">{milestone.title}</div><div className="task-meta">{milestone.dueDate ? `Due ${new Date(milestone.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "No due date"}</div></div><select aria-label={`Status for ${milestone.title}`} value={milestone.status} onChange={(event) => void updateStatus(project.id, milestone, event.target.value as MilestoneStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>) : <p className="empty-state">No milestones yet.</p>}</div><form className="milestone-form" onSubmit={(event) => void createMilestone(project.id, event)}><input aria-label={`Milestone title for ${project.name}`} name="title" maxLength={160} placeholder="Add a milestone" required /><input aria-label="Milestone due date" name="dueDate" type="date" /><button className="button-primary" disabled={submittingProjectId === project.id} type="submit">{submittingProjectId === project.id ? "Adding" : "Add milestone"}</button></form></article>)}</section>;
}
