/*
  Warnings:

  - You are about to drop the column `customerId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CostumerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskStatus" ADD VALUE 'DEFINE_DEADLINE';
ALTER TYPE "TaskStatus" ADD VALUE 'IN_CHANGE';
ALTER TYPE "TaskStatus" ADD VALUE 'IN_APPROVAL';

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_customerId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "customerId",
ADD COLUMN     "CostumerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "Costumer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Costumer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_CostumerId_fkey" FOREIGN KEY ("CostumerId") REFERENCES "Costumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
