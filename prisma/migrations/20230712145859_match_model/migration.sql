-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE `Match` (
    `id` VARCHAR(191) NOT NULL,
    `tournamentId` VARCHAR(191) NOT NULL,

    INDEX `Match_tournamentId_idx`(`tournamentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
