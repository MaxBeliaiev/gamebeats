/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `loserId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `result` ADD COLUMN `loserId` INTEGER NOT NULL,
    ADD COLUMN `winnerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;

-- CreateIndex
CREATE INDEX `Result_winnerId_idx` ON `Result`(`winnerId`);

-- CreateIndex
CREATE INDEX `Result_loserId_idx` ON `Result`(`loserId`);
