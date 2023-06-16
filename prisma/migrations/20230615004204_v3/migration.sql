/*
  Warnings:

  - You are about to drop the column `rol_id` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `Usuarios_rol_id_fkey`;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `rol_id`,
    ADD COLUMN `role` ENUM('ESTUDIANTE', 'MAESTRO', 'COORDINADOR') NOT NULL DEFAULT 'ESTUDIANTE';

-- DropTable
DROP TABLE `roles`;
