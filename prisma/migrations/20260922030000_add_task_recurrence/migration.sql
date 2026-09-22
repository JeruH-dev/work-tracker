-- CreateEnum
CREATE TYPE "RecurrenceRule" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Task"
    ADD COLUMN "recurrenceRule" "RecurrenceRule" NOT NULL DEFAULT 'NONE',
    ADD COLUMN "recurrenceEndDate" TIMESTAMP(3);
