/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `discipline` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL;

-- DropTable
DROP TABLE `discipline`;

-- CreateTable
CREATE TABLE `Disciplines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
