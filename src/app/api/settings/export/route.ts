import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "json";
  const [tasks, projects, activities] = await Promise.all([
    prisma.task.findMany({ where: { assigneeId: user.id }, select: { taskRef: true, title: true, status: true, priority: true, dueDate: true, createdAt: true, updatedAt: true } }),
    prisma.project.findMany({ where: { ownerId: user.id }, select: { projectRef: true, name: true, status: true, workstream: true, createdAt: true, updatedAt: true } }),
    prisma.activity.findMany({ where: { authorId: user.id }, select: { note: true, occurredAt: true }, orderBy: { occurredAt: "desc" } }),
  ]);

  if (format === "csv") {
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Type", "Reference", "Name", "Status", "Priority/Workstream", "Due date", "Created"],
      ...tasks.map((task) => ["Task", task.taskRef, task.title, task.status, task.priority, task.dueDate?.toISOString(), task.createdAt.toISOString()]),
      ...projects.map((project) => ["Project", project.projectRef, project.name, project.status, project.workstream, "", project.createdAt.toISOString()]),
    ];
    return new NextResponse(rows.map((row) => row.map(escape).join(",")).join("\n"), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=work-tracker-export.csv" },
    });
  }

  return NextResponse.json({ exportedAt: new Date().toISOString(), user, tasks, projects, activities }, {
    headers: { "Content-Disposition": "attachment; filename=work-tracker-export.json" },
  });
}