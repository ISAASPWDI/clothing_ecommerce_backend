/*
  Warnings:

  - The values [manual,provider] on the enum `users_auth_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `rol` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `auth_type` ENUM('MANUAL', 'PROVIDER') NOT NULL,
    MODIFY `rol` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
