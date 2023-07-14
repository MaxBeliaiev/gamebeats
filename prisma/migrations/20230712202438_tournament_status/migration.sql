/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'FINISHED', 'DELETED') NOT NULL DEFAULT 'ACTIVE';
