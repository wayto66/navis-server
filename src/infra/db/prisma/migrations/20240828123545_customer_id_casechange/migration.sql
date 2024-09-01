/*
  Warnings:

  - You are about to drop the column `costumerId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_costumerId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "costumerId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Costumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
