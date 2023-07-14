/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[matchId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Result_matchId_key` ON `Result`(`matchId`);
