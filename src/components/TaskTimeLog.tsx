"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "COMPLETED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TimeEntry = { id: string; durationMinutes: number; note: string | null; occurredAt: string };
type Dependency = { id: string; dependencyTask: { id: string; title: string } };
type Reminder = { id: string; message: string; scheduledFor: string };
type Task = { id: string; title: string; status: Status; priority: Priority; project: { name: string } | null; dependencies: Dependency[]; reminders: Reminder[]; timeEntries: TimeEntry[] };

const statusLabels: Record<Status, string> = { BACKLOG: "Backlog", IN_PROGRESS: "In progress", BLOCKED: "Blocked", IN_REVIEW: "In review", COMPLETED: "Completed" };
const priorityLabels: Record<Priority, string> = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent" };

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder ? `${remainder}m` : ""}`.trim() : `${remainder}m`;
}

function formatEntryDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function TaskTimeLog({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  function toggleTaskDetails(taskId: string) {
    setExpandedTaskIds((current) => {
      const next = new Set(current);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  async function addEntry(taskId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmittingTaskId(taskId);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch(`/api/tasks/${taskId}/time-entries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ durationMinutes: form.get("durationMinutes"), note: form.get("note") || undefined, occurredAt: form.get("occurredAt") || undefined }) });
    const payload = await response.json().catch(() => ({}));
    setSubmittingTaskId(null);
    if (!response.ok) return setError(payload.error ?? "Unable to log time");
    formElement.reset();
    router.refresh();
  }

  async function removeEntry(taskId: string, entryId: string) {
    const response = await fetch(`/api/tasks/${taskId}/time-entries/${entryId}`, { method: "DELETE" });
    if (!response.ok) setError("Unable to remove time entry");
    else router.refresh();
  }

  async function addDependency(taskId: string, dependencyTaskId: string) {
    if (!dependencyTaskId) return;
    const response = await fetch(`/api/tasks/${taskId}/dependencies`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dependencyTaskId }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return setError(payload.error ?? "Unable to add dependency");
    router.refresh();
  }

  async function removeDependency(taskId: string, dependencyId: string) {
    const response = await fetch(`/api/tasks/${taskId}/dependencies/${dependencyId}`, { method: "DELETE" });
    if (!response.ok) setError("Unable to remove dependency");
    else router.refresh();
  }

  async function addReminder(taskId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const message = String(form.get("message") ?? "").trim();
    const scheduledFor = form.get("scheduledFor");
    if (!message || !scheduledFor) return setError("Reminder message and time are required.");
    const response = await fetch(`/api/tasks/${taskId}/reminders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, scheduledFor }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return setError(payload.error ?? "Unable to add reminder");
    formElement.reset();
    router.refresh();
  }

  async function removeReminder(taskId: string, reminderId: string) {
    const response = await fetch(`/api/tasks/${taskId}/reminders/${reminderId}`, { method: "DELETE" });
    if (!response.ok) setError("Unable to remove reminder");
    else router.refresh();
  }

  if (!tasks.length) return <p className="empty-state">No tasks yet. Add the first thing that needs your attention.</p>;

  return <section className="task-log-list" aria-label="Tasks and time logs">
    {error && <p className="form-error" role="alert">{error}</p>}
    {tasks.map((task) => {
      const totalMinutes = task.timeEntries.reduce((total, entry) => total + entry.durationMinutes, 0);
      const availableDependencies = tasks.filter((candidate) => candidate.id !== task.id && !task.dependencies.some((dependency) => dependency.dependencyTask.id === candidate.id));
      const isExpanded = expandedTaskIds.has(task.id);

      return <article className={`task-log-panel${isExpanded ? " is-expanded" : ""}`} key={task.id}>
        <div className="task-log-heading">
          <div><h3>{task.title}</h3><div className="task-meta">{task.project?.name ?? "No project"} · {statusLabels[task.status]} · {priorityLabels[task.priority]}</div></div>
          <strong>{formatDuration(totalMinutes)} logged</strong>
          <button className="details-toggle" type="button" aria-expanded={isExpanded} aria-label={`${isExpanded ? "Hide" : "Show"} details for ${task.title}`} onClick={() => toggleTaskDetails(task.id)}><span aria-hidden="true">{isExpanded ? "⌃" : "⌄"}</span></button>
        </div>
        {isExpanded && <div className="task-details">
          <div className="task-dependency-panel">
            <div className="task-meta task-label">Dependencies</div>
            {task.dependencies.length ? <div className="dependency-list">{task.dependencies.map((dependency) => <div className="dependency-row" key={dependency.id}><span>{dependency.dependencyTask.title}</span><button className="button-quiet" onClick={() => void removeDependency(task.id, dependency.id)} type="button">Remove</button></div>)}</div> : <p className="empty-state">No prerequisites for this task.</p>}
            <div className="dependency-form"><select aria-label={`Add dependency to ${task.title}`} defaultValue="" onChange={(event) => { const value = event.target.value; if (value) { void addDependency(task.id, value); event.currentTarget.value = ""; } }}><option value="">Add dependency</option>{availableDependencies.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.title}</option>)}</select></div>
          </div>
          <div className="task-dependency-panel">
            <div className="task-meta task-label">Reminders</div>
            {task.reminders.length ? <div className="dependency-list">{task.reminders.map((reminder) => <div className="dependency-row" key={reminder.id}><span>{reminder.message} · {new Date(reminder.scheduledFor).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span><button className="button-quiet" onClick={() => void removeReminder(task.id, reminder.id)} type="button">Remove</button></div>)}</div> : <p className="empty-state">No reminders set.</p>}
            <form className="dependency-form" onSubmit={(event) => void addReminder(task.id, event)}><input aria-label={`Reminder message for ${task.title}`} name="message" placeholder="Reminder message" required /><input aria-label={`Reminder time for ${task.title}`} name="scheduledFor" required type="datetime-local" /><button className="button-quiet" type="submit">Add reminder</button></form>
          </div>
          <div className="time-entry-list">{task.timeEntries.length ? task.timeEntries.map((entry) => <div className="time-entry-row" key={entry.id}><div><span className="time-entry-duration">{formatDuration(entry.durationMinutes)}</span><span className="task-meta">{formatEntryDate(entry.occurredAt)}</span>{entry.note && <div className="time-entry-note">{entry.note}</div>}</div><button className="button-quiet" onClick={() => void removeEntry(task.id, entry.id)} type="button">Remove</button></div>) : <p className="empty-state">No time logged yet.</p>}</div>
          <form className="time-entry-form" onSubmit={(event) => void addEntry(task.id, event)}><input aria-label={`Minutes logged for ${task.title}`} min="1" name="durationMinutes" placeholder="Minutes" required type="number" /><input aria-label={`Time entry note for ${task.title}`} name="note" placeholder="What moved forward?" /><input aria-label={`Time entry date for ${task.title}`} name="occurredAt" type="date" /><button className="button-primary" disabled={submittingTaskId === task.id} type="submit">{submittingTaskId === task.id ? "Saving" : "Log time"}</button></form>
        </div>}
      </article>;
    })}
  </section>;
}
