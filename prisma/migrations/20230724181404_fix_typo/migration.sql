/*
  Warnings:

  - You are about to drop the column `adminAuthoriserId` on the `Matchmaker` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Matchmaker` DROP FOREIGN KEY `Matchmaker_adminAuthoriserId_fkey`;

-- AlterTable
ALTER TABLE `Matchmaker` DROP COLUMN `adminAuthoriserId`,
    ADD COLUMN `adminAuthorizerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Matchmaker` ADD CONSTRAINT `Matchmaker_adminAuthorizerId_fkey` FOREIGN KEY (`adminAuthorizerId`) REFERENCES `Admin`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
