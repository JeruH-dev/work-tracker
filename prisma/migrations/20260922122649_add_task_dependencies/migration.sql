-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "dependencyTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskDependency_taskId_idx" ON "TaskDependency"("taskId");

-- CreateIndex
CREATE INDEX "TaskDependency_dependencyTaskId_idx" ON "TaskDependency"("dependencyTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_taskId_dependencyTaskId_key" ON "TaskDependency"("taskId", "dependencyTaskId");

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependencyTaskId_fkey" FOREIGN KEY ("dependencyTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
