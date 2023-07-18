/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `competitor` table. All the data in the column will be lost.
  - The values [DELETED] on the enum `Competitor_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assignedAt` on the `matches_competitors` table. All the data in the column will be lost.
  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `competitor` DROP COLUMN `deletedAt`,
    ADD COLUMN `archivedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `matches_competitors` DROP COLUMN `assignedAt`;

-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;
