-- AlterTable
ALTER TABLE `tipodeporte` ADD COLUMN `skipAsistencia` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `skipCoordinacion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `skipMaestro` BOOLEAN NOT NULL DEFAULT false;
