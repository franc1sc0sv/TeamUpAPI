-- DropForeignKey
ALTER TABLE `partidos` DROP FOREIGN KEY `Partidos_id_equipo_local_fkey`;

-- DropForeignKey
ALTER TABLE `partidos` DROP FOREIGN KEY `Partidos_id_equipo_visitante_fkey`;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_local_fkey` FOREIGN KEY (`id_equipo_local`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_visitante_fkey` FOREIGN KEY (`id_equipo_visitante`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
