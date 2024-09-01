/*
  Warnings:

  - You are about to drop the column `userId` on the `Routine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_userId_fkey";

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "userId";
