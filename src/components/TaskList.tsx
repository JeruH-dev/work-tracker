"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "COMPLETED";
  dueDate: Date | null;
  outcome: string | null;
  nextAction: string | null;
  blocker: string | null;
  projectId: string | null;
  project: { name: string } | null;
};

const statusLabel: Record<Task["status"], string> = { BACKLOG: "Backlog", IN_PROGRESS: "In progress", BLOCKED: "Blocked", IN_REVIEW: "In review", COMPLETED: "Completed" };

function toneForStatus(status: Task["status"]) {
  if (status === "BLOCKED") return "red";
  if (status === "IN_REVIEW") return "amber";
  return "green";
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

  if (!tasks.length) return <p className="empty-state">No tasks yet. Add the first thing that needs your attention.</p>;

  return <div>{tasks.map((task) => {
    const tone = toneForStatus(task.status);
    return <div className="task-row" key={task.id}><span className={`task-dot ${tone}`} /><div><div className="task-name">{task.title}</div><div className="task-meta">{task.project?.name ?? "No project"}</div></div><div className="task-actions"><span className={`task-status status-${tone === "green" ? "progress" : tone === "red" ? "blocked" : "review"}`}>{statusLabel[task.status]}</span>{task.status !== "COMPLETED" && <button className="button-quiet" disabled={updatingId === task.id} onClick={() => completeTask(task)}>Complete</button>}</div></div>;
  })}</div>;
}
