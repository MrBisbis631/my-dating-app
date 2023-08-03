-- AlterTable
ALTER TABLE `Answer` ADD COLUMN `optionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
