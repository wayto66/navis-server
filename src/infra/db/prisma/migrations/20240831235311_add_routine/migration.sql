-- CreateEnum
CREATE TYPE "RoutineMode" AS ENUM ('WEEKLY', 'MONTHLY', 'MONTH_COUNT', 'DAY_COUNT');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "routineId" INTEGER;

-- CreateTable
CREATE TABLE "Routine" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mode" "RoutineMode" NOT NULL,
    "dayCount" INTEGER,
    "weekDays" INTEGER[],
    "monthDays" INTEGER[],
    "yearDay" INTEGER,
    "yearMonth" INTEGER,
    "monthCount" INTEGER,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "lastSolved" TIMESTAMP(3),
    "targetDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
