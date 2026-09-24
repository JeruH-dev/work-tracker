"use client";

import { DragEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "BACKLOG" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW" | "COMPLETED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type BoardTask = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  outcome: string | null;
  nextAction: string | null;
  blocker: string | null;
  projectId: string | null;
  project: { name: string } | null;
};

type Column = { status: Status; label: string; tone: string };

const columns: Column[] = [
  { status: "BACKLOG", label: "Backlog", tone: "neutral" },
  { status: "IN_PROGRESS", label: "In progress", tone: "blue" },
  { status: "BLOCKED", label: "Blocked", tone: "red" },
  { status: "IN_REVIEW", label: "In review", tone: "amber" },
  { status: "COMPLETED", label: "Completed", tone: "green" },
];

const priorityLabel: Record<Priority, string> = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent" };

export function KanbanBoard({ tasks }: { tasks: BoardTask[] }) {
  const router = useRouter();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function tasksFor(status: Status) {
    return tasks.filter((task) => task.status === status);
  }

  async function moveTask(task: BoardTask, status: Status) {
    if (task.status === status) return;
    setError(null);
    setUpdatingTaskId(task.id);
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description ?? undefined,
        priority: task.priority,
        status,
        dueDate: task.dueDate ?? undefined,
        outcome: task.outcome ?? undefined,
        nextAction: task.nextAction ?? undefined,
        blocker: task.blocker ?? undefined,
        projectId: task.projectId ?? undefined,
      }),
    });
    setUpdatingTaskId(null);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Unable to move task");
      return;
    }
    router.refresh();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, status: Status) {
    event.preventDefault();
    const task = tasks.find((item) => item.id === draggedTaskId);
    setDraggedTaskId(null);
    if (task) void moveTask(task, status);
  }

  return (
    <section aria-label="Kanban task board">
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = tasksFor(column.status);
          return (
            <div className={`kanban-column column-${column.tone}`} key={column.status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, column.status)}>
              <div className="kanban-column-heading"><div><div className="kanban-column-title">{column.label}</div><div className="kanban-column-count">{columnTasks.length} {columnTasks.length === 1 ? "task" : "tasks"}</div></div><span className="column-marker" aria-hidden="true" /></div>
              <div className="kanban-cards">
                {columnTasks.map((task) => (
                  <article className={`kanban-card${draggedTaskId === task.id ? " is-dragging" : ""}`} draggable={updatingTaskId !== task.id} key={task.id} onDragEnd={() => setDraggedTaskId(null)} onDragStart={() => setDraggedTaskId(task.id)}>
                    <div className="kanban-card-top"><span className={`priority priority-${task.priority.toLowerCase()}`}>{priorityLabel[task.priority]}</span>{task.dueDate && <time dateTime={task.dueDate}>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>}</div>
                    <h3>{task.title}</h3>
                    <div className="task-meta">{task.project?.name ?? "No project"}</div>
                    <label className="kanban-status-select">Move to<select aria-label={`Move ${task.title}`} disabled={updatingTaskId === task.id} value={task.status} onChange={(event) => void moveTask(task, event.target.value as Status)}>{columns.map((option) => <option key={option.status} value={option.status}>{option.label}</option>)}</select></label>
                  </article>
                ))}
                {!columnTasks.length && <div className="kanban-empty">Drop tasks here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
