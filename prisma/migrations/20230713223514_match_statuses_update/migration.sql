/*
  Warnings:

  - You are about to alter the column `status` on the `match` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(3))`.
  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `match` MODIFY `status` ENUM('UPCOMING', 'ONGOING', 'FINISHED', 'DELETED') NOT NULL DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;
