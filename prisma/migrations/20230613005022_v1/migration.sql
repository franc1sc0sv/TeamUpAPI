-- CreateTable
CREATE TABLE `Usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rol_id` INTEGER NOT NULL,

    UNIQUE INDEX `Usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NivelAcademico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nivel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosNivelAcademico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estudiante` INTEGER NOT NULL,
    `id_nivelAcademico` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `limiteJugadores` INTEGER NOT NULL,
    `limiteJugadoresCambio` INTEGER NOT NULL,
    `id_tipoDeporte` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDeporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ZonaDejuego` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `id_deporte` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenesZonaDeJuego` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imagen_url` VARCHAR(191) NOT NULL,
    `id_zonaDeJuego` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NOT NULL,
    `password_access` VARCHAR(191) NOT NULL,
    `id_lider` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosEquipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_equipo` INTEGER NOT NULL,
    `id_usuarios` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `id_estado` INTEGER NOT NULL,
    `id_usuarioMaestro` INTEGER NULL,
    `id_deporte` INTEGER NOT NULL,
    `id_equipo_local` INTEGER NOT NULL,
    `id_equipo_visitante` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosPartidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `esReserva` BOOLEAN NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_partido` INTEGER NOT NULL,
    `id_equipo` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartidosEstado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosNivelAcademico` ADD CONSTRAINT `UsuariosNivelAcademico_id_estudiante_fkey` FOREIGN KEY (`id_estudiante`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosNivelAcademico` ADD CONSTRAINT `UsuariosNivelAcademico_id_nivelAcademico_fkey` FOREIGN KEY (`id_nivelAcademico`) REFERENCES `NivelAcademico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deporte` ADD CONSTRAINT `Deporte_id_tipoDeporte_fkey` FOREIGN KEY (`id_tipoDeporte`) REFERENCES `TipoDeporte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ZonaDejuego` ADD CONSTRAINT `ZonaDejuego_id_deporte_fkey` FOREIGN KEY (`id_deporte`) REFERENCES `Deporte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImagenesZonaDeJuego` ADD CONSTRAINT `ImagenesZonaDeJuego_id_zonaDeJuego_fkey` FOREIGN KEY (`id_zonaDeJuego`) REFERENCES `ZonaDejuego`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipos` ADD CONSTRAINT `Equipos_id_lider_fkey` FOREIGN KEY (`id_lider`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosEquipos` ADD CONSTRAINT `UsuariosEquipos_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosEquipos` ADD CONSTRAINT `UsuariosEquipos_id_usuarios_fkey` FOREIGN KEY (`id_usuarios`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `PartidosEstado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_usuarioMaestro_fkey` FOREIGN KEY (`id_usuarioMaestro`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_deporte_fkey` FOREIGN KEY (`id_deporte`) REFERENCES `Deporte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_local_fkey` FOREIGN KEY (`id_equipo_local`) REFERENCES `Equipos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_visitante_fkey` FOREIGN KEY (`id_equipo_visitante`) REFERENCES `Equipos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_partido_fkey` FOREIGN KEY (`id_partido`) REFERENCES `Partidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
