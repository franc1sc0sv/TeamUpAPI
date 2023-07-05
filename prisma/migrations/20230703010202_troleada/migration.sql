/*
  Warnings:

  - You are about to drop the `usuariosnivelacademico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_nivelAcademico` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `usuariosnivelacademico` DROP FOREIGN KEY `UsuariosNivelAcademico_id_estudiante_fkey`;

-- DropForeignKey
ALTER TABLE `usuariosnivelacademico` DROP FOREIGN KEY `UsuariosNivelAcademico_id_nivelAcademico_fkey`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `id_nivelAcademico` INTEGER NOT NULL;

-- DropTable
DROP TABLE `usuariosnivelacademico`;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_id_nivelAcademico_fkey` FOREIGN KEY (`id_nivelAcademico`) REFERENCES `NivelAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
