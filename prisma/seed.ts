import { PrismaClient, ProjectStatus, Priority, TaskStatus, Workstream } from "@prisma/client";
import { hashPassword } from "../src/lib/passwords";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({ where: { email: "gideon@example.com" }, update: {}, create: { name: "Gideon O.", email: "gideon@example.com", passwordHash: await hashPassword("ChangeMeBeforeUse!") } });
  const project = await prisma.project.create({ data: { projectRef: "PROJ-0001", name: "Programme Reporting", description: "Reliable reporting for programme decisions.", status: ProjectStatus.ACTIVE, workstream: Workstream.REPORTING, ownerId: user.id } });
  await prisma.task.create({ data: { taskRef: "TASK-0001", title: "Resolve Q3 reporting data gap", priority: Priority.HIGH, status: TaskStatus.BLOCKED, blocker: "Awaiting source data confirmation.", projectId: project.id, assigneeId: user.id } });
  await prisma.activity.create({ data: { note: "Created the initial reporting task.", taskId: (await prisma.task.findUniqueOrThrow({ where: { taskRef: "TASK-0001" } })).id, authorId: user.id } });
}

main().finally(() => prisma.$disconnect());
