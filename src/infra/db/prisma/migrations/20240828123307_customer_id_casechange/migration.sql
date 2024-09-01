/*
  Warnings:

  - You are about to drop the column `CostumerId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `costumerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_CostumerId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "CostumerId",
ADD COLUMN     "costumerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_costumerId_fkey" FOREIGN KEY ("costumerId") REFERENCES "Costumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
