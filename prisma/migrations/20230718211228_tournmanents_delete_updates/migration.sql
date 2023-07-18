/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `tournament` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - The values [DELETED] on the enum `Tournament_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tournament` MODIFY `updatedAt` DATETIME NOT NULL,
    MODIFY `status` ENUM('UPCOMING', 'ONGOING', 'FINISHED') NOT NULL DEFAULT 'UPCOMING';

-- CreateIndex
CREATE UNIQUE INDEX `Tournament_name_key` ON `Tournament`(`name`);
