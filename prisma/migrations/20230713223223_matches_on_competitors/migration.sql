/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `MatchesOnCompetitors` (
    `matchId` INTEGER NOT NULL,
    `competitorId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MatchesOnCompetitors_competitorId_idx`(`competitorId`),
    INDEX `MatchesOnCompetitors_matchId_idx`(`matchId`),
    PRIMARY KEY (`matchId`, `competitorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
