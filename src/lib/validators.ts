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
});

export const projectInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).default("PLANNING"),
  workstream: z.enum(["PROGRAMME_SUPPORT", "OPERATIONS", "REPORTING", "PARTNERSHIPS", "PROFESSIONAL_DEVELOPMENT", "OTHER"]),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(12).max(128),
});

export const signInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
