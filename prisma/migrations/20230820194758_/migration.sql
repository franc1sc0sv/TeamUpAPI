/*
  Warnings:

  - You are about to drop the column `skipAsistencia` on the `tipodeporte` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[password_token]` on the table `Equipos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invitaciones_token]` on the table `Equipos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `equipos` ADD COLUMN `invitaciones_token` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `password_token` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `tipodeporte` DROP COLUMN `skipAsistencia`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `token` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Equipos_password_token_key` ON `Equipos`(`password_token`);

-- CreateIndex
CREATE UNIQUE INDEX `Equipos_invitaciones_token_key` ON `Equipos`(`invitaciones_token`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuarios_token_key` ON `Usuarios`(`token`);
