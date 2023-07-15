-- AlterTable
ALTER TABLE `partidos` ADD COLUMN `id_zona_juego` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_zona_juego_fkey` FOREIGN KEY (`id_zona_juego`) REFERENCES `ZonaDejuego`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
