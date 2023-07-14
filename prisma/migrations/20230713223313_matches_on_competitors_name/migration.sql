/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `matchesoncompetitors` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;

-- DropTable
DROP TABLE `matchesoncompetitors`;

-- CreateTable
CREATE TABLE `matches_competitors` (
    `matchId` INTEGER NOT NULL,
    `competitorId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `matches_competitors_competitorId_idx`(`competitorId`),
    INDEX `matches_competitors_matchId_idx`(`matchId`),
    PRIMARY KEY (`matchId`, `competitorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
