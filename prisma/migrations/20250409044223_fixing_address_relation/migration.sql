/*
  Warnings:

  - You are about to drop the column `address_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_address_id_fkey`;

-- DropIndex
DROP INDEX `users_address_id_idx` ON `users`;

-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `address_id`;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
