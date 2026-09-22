"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RecurrenceRule = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "COMPLETED";
  dueDate: Date | string | null;
  outcome: string | null;
  nextAction: string | null;
  blocker: string | null;
  projectId: string | null;
  recurrenceRule: RecurrenceRule;
  recurrenceEndDate: Date | string | null;
  project: { name: string } | null;
};

const statusLabel: Record<Task["status"], string> = { BACKLOG: "Backlog", IN_PROGRESS: "In progress", BLOCKED: "Blocked", IN_REVIEW: "In review", COMPLETED: "Completed" };
const recurrenceLabel: Record<RecurrenceRule, string> = { NONE: "Do not repeat", DAILY: "Daily", WEEKLY: "Weekly", MONTHLY: "Monthly" };

function toneForStatus(status: Task["status"]) {
  if (status === "BLOCKED") return "red";
  if (status === "IN_REVIEW") return "amber";
  return "green";
}

function formatDateValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const nextDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(nextDate.getTime())) return "";
  return nextDate.toISOString().slice(0, 10);
}

function formatDateLabel(value: Date | string | null | undefined) {
  if (!value) return "";
  const nextDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(nextDate.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(nextDate);
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function completeTask(task: Task) {
    setUpdatingId(task.id);
    const response = await fetch(`/api/tasks/${task.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...task, status: "COMPLETED" }) });
    setUpdatingId(null);
    if (response.ok) router.refresh();
  }

  async function updateRecurrence(task: Task, recurrenceRule: RecurrenceRule) {
    setUpdatingId(task.id);
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        recurrenceRule,
        recurrenceEndDate: recurrenceRule === "NONE" ? undefined : task.recurrenceEndDate ?? undefined,
      }),
    });
    setUpdatingId(null);
    if (response.ok) router.refresh();
  }

  async function updateRecurrenceEnd(task: Task, recurrenceEndDate: string) {
    setUpdatingId(task.id);
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        recurrenceRule: task.recurrenceRule,
        recurrenceEndDate: recurrenceEndDate || undefined,
      }),
    });
    setUpdatingId(null);
    if (response.ok) router.refresh();
  }

  if (!tasks.length) return <p className="empty-state">No tasks yet. Add the first thing that needs your attention.</p>;

  return <div>{tasks.map((task) => {
    const tone = toneForStatus(task.status);
    const recurrence = task.recurrenceRule !== "NONE" ? `${recurrenceLabel[task.recurrenceRule]}${task.recurrenceEndDate ? ` until ${formatDateLabel(task.recurrenceEndDate)}` : ""}` : "No repeat";

    return <div className="task-row" key={task.id}><span className={`task-dot ${tone}`} /><div className="task-main"><div className="task-name">{task.title}</div><div className="task-meta">{task.project?.name ?? "No project"}</div><div className="task-meta task-recurrence-copy">{recurrence}</div><div className="task-recurrence"><label>Repeat<select aria-label={`Repeat settings for ${task.title}`} disabled={updatingId === task.id} value={task.recurrenceRule} onChange={(event) => void updateRecurrence(task, event.target.value as RecurrenceRule)}>{Object.entries(recurrenceLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Until<input aria-label={`Repeat end for ${task.title}`} disabled={updatingId === task.id || task.recurrenceRule === "NONE"} type="date" value={formatDateValue(task.recurrenceEndDate)} onChange={(event) => void updateRecurrenceEnd(task, event.target.value)} /></label></div></div><div className="task-actions"><span className={`task-status status-${tone === "green" ? "progress" : tone === "red" ? "blocked" : "review"}`}>{statusLabel[task.status]}</span>{task.status !== "COMPLETED" && <button className="button-quiet" disabled={updatingId === task.id} onClick={() => void completeTask(task)}>Complete</button>}</div></div>;
  })}</div>;
}
