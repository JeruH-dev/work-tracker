"use client";

import { normalizeTaskPayload } from "@/lib/recurrence";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Project = { id: string; name: string };

export function NewTaskForm({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = normalizeTaskPayload(Object.fromEntries(new FormData(event.currentTarget)));
    const response = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);
    if (!response.ok) return setError(payload.error ?? "Unable to create task");
    setOpen(false);
    router.refresh();
  }

  return <div className="new-task"><button className="button-primary" onClick={() => setOpen((value) => !value)} type="button">{open ? "Close" : "+ New task"}</button>{open && <form className="task-form" onSubmit={submit}><label>Task<input name="title" maxLength={160} required /></label><label>Project<select name="projectId" defaultValue=""><option value="">No project</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label>Priority<select name="priority" defaultValue="MEDIUM"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></label><label>Due date<input name="dueDate" type="date" /></label><label>Repeat<select name="recurrenceRule" defaultValue="NONE"><option value="NONE">Do not repeat</option><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option></select></label><label>Repeat until<input name="recurrenceEndDate" type="date" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-primary" disabled={submitting} type="submit">{submitting ? "Creating" : "Create task"}</button></form>}</div>;
}
