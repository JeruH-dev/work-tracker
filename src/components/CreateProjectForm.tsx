"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const workstreams = [
  ["PROGRAMME_SUPPORT", "Programme support"],
  ["OPERATIONS", "Operations"],
  ["REPORTING", "Reporting"],
  ["PARTNERSHIPS", "Partnerships"],
  ["PROFESSIONAL_DEVELOPMENT", "Professional development"],
  ["OTHER", "Other"],
] as const;

export function CreateProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description") || undefined,
        workstream: form.get("workstream"),
        status: form.get("status"),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    setSubmitting(false);
    if (!response.ok) {
      setError(payload.error ?? "Unable to create project");
      return;
    }
    formElement.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="create-project">
      <button className="button-primary create-project-trigger" type="button" onClick={() => { setOpen((value) => !value); setError(null); }} aria-expanded={open} aria-controls="create-project-form">
        <span aria-hidden="true">+</span>{open ? "Close" : "New project"}
      </button>
      {open && <form className="create-project-form" id="create-project-form" onSubmit={(event) => void createProject(event)}>
        <div className="create-project-form-heading"><strong>Start a project</strong><span>Give the work a clear home.</span></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>Project name<input name="name" maxLength={160} placeholder="e.g. Q4 programme review" required autoFocus /></label>
        <label>Description<textarea name="description" maxLength={2000} placeholder="What outcome will this project deliver?" rows={3} /></label>
        <div className="create-project-form-grid">
          <label>Workstream<select name="workstream" defaultValue="OTHER">{workstreams.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Status<select name="status" defaultValue="PLANNING"><option value="PLANNING">Planning</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option></select></label>
        </div>
        <button className="button-primary" disabled={submitting} type="submit">{submitting ? "Creating project..." : "Create project"}</button>
      </form>}
    </div>
  );
}
