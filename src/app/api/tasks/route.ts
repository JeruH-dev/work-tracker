import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/services/tasks";

export async function GET() {
  return NextResponse.json(await listTasks());
}

export async function POST(request: Request) {
  try {
    const task = await createTask(await request.json());
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid task" }, { status: 400 });
  }
}
