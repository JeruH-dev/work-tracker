export function normalizeReminderInput(input: { message?: string; scheduledFor?: string | Date }) {
  const message = String(input.message ?? "").trim();
  if (!message) {
    throw new Error("Reminder message is required.");
  }

  const scheduledFor = input.scheduledFor ? new Date(input.scheduledFor) : new Date();
  if (Number.isNaN(scheduledFor.getTime())) {
    throw new Error("Reminder schedule is invalid.");
  }

  return { message, scheduledFor };
}
