/*
  Warnings:

  - Added the required column `nombre` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `nombre` VARCHAR(191) NOT NULL;
