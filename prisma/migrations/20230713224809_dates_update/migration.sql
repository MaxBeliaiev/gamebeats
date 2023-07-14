/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `match` ADD COLUMN `endedAt` DATETIME(3) NULL,
    ADD COLUMN `startedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `tournament` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `updatedAt` DATETIME NOT NULL;
