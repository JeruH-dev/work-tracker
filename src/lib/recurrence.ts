export type RecurrenceTaskPayload = {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  outcome?: string;
  nextAction?: string;
  blocker?: string;
  projectId?: string | null;
  recurrenceRule?: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
  recurrenceEndDate?: string | null;
};

export function normalizeTaskPayload(data: Record<string, unknown>) {
  const normalized = { ...data } as Record<string, unknown>;

  if (!normalized.projectId) delete normalized.projectId;
  if (!normalized.dueDate) delete normalized.dueDate;
  if (normalized.recurrenceRule === "NONE") {
    delete normalized.recurrenceRule;
    delete normalized.recurrenceEndDate;
  } else if (!normalized.recurrenceEndDate) {
    delete normalized.recurrenceEndDate;
  }

  if (normalized.description === "") delete normalized.description;
  if (normalized.outcome === "") delete normalized.outcome;
  if (normalized.nextAction === "") delete normalized.nextAction;
  if (normalized.blocker === "") delete normalized.blocker;

  return normalized;
}
