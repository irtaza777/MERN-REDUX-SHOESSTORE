/*
  Warnings:

  - Added the required column `color` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `color` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL;
