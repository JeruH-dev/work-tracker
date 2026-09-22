import { z } from "zod";

export const taskInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["BACKLOG", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "COMPLETED"]).default("BACKLOG"),
  dueDate: z.coerce.date().optional(),
  outcome: z.string().trim().max(2000).optional(),
  nextAction: z.string().trim().max(1000).optional(),
  blocker: z.string().trim().max(1000).optional(),
  projectId: z.string().cuid().nullable().optional(),
  recurrenceRule: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]).optional(),
  recurrenceEndDate: z.coerce.date().optional(),
});

export const projectInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).default("PLANNING"),
  workstream: z.enum(["PROGRAMME_SUPPORT", "OPERATIONS", "REPORTING", "PARTNERSHIPS", "PROFESSIONAL_DEVELOPMENT", "OTHER"]),
});

export const milestoneInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]).default("PLANNED"),
});

export const timeEntryInputSchema = z.object({
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  note: z.string().trim().max(1000).optional(),
  occurredAt: z.coerce.date().optional(),
});

export const reminderInputSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  scheduledFor: z.coerce.date(),
});

export const taskDependencyInputSchema = z.object({
  dependencyTaskId: z.string().cuid(),
});

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128).refine((value) => passwordPolicy.test(value), {
    message: "Password must be at least 8 characters and include upper/lowercase letters and a number",
  }),
  confirmPassword: z.string().min(8).max(128).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export const passwordResetRequestSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128).refine((value) => passwordPolicy.test(value), {
    message: "Password must be at least 8 characters and include upper/lowercase letters and a number",
  }),
  confirmPassword: z.string().min(8).max(128),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type TaskInput = z.infer<typeof taskInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type MilestoneInput = z.infer<typeof milestoneInputSchema>;
export type TimeEntryInput = z.infer<typeof timeEntryInputSchema>;
export type ReminderInput = z.infer<typeof reminderInputSchema>;
export type TaskDependencyInput = z.infer<typeof taskDependencyInputSchema>;
