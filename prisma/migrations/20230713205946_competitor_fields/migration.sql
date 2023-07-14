/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `nickname` to the `Competitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Competitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `competitor` ADD COLUMN `birthDate` DATETIME(3) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL,
    ADD COLUMN `surname` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tournament` MODIFY `startedAt` DATETIME(3) NULL,
    MODIFY `updatedAt` DATETIME NOT NULL;
