-- CreateTable
CREATE TABLE `NivelAcademico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nivel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoDeporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `skipMaestro` BOOLEAN NOT NULL DEFAULT false,
    `skipCoordinacion` BOOLEAN NOT NULL DEFAULT false,
    `opcionalMaestro` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartidosEstado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `fase` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL DEFAULT '',
    `id_nivelAcademico` INTEGER NOT NULL,
    `role` ENUM('ESTUDIANTE', 'MAESTRO', 'COORDINADOR') NOT NULL DEFAULT 'ESTUDIANTE',

    UNIQUE INDEX `Usuarios_email_key`(`email`),
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
    `password_token` VARCHAR(191) NOT NULL,
    `invitaciones_token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Equipos_password_token_key`(`password_token`),
    UNIQUE INDEX `Equipos_invitaciones_token_key`(`invitaciones_token`),
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
    `id_zona_juego` INTEGER NULL,
    `maestro_intermediario` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartidoResultado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_partido` INTEGER NOT NULL,
    `id_usuario_resultadoAceptar` INTEGER NULL,
    `id_usuario_resultadoPublicar` INTEGER NULL,
    `resultado_local` INTEGER NOT NULL,
    `resultado_visitante` INTEGER NOT NULL,
    `confirmado` BOOLEAN NOT NULL DEFAULT false,
    `enviadoListo` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `PartidoResultado_id_partido_key`(`id_partido`),
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

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_id_nivelAcademico_fkey` FOREIGN KEY (`id_nivelAcademico`) REFERENCES `NivelAcademico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_local_fkey` FOREIGN KEY (`id_equipo_local`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_equipo_visitante_fkey` FOREIGN KEY (`id_equipo_visitante`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partidos` ADD CONSTRAINT `Partidos_id_zona_juego_fkey` FOREIGN KEY (`id_zona_juego`) REFERENCES `ZonaDejuego`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_partido_fkey` FOREIGN KEY (`id_partido`) REFERENCES `Partidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_usuario_resultadoAceptar_fkey` FOREIGN KEY (`id_usuario_resultadoAceptar`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_usuario_resultadoPublicar_fkey` FOREIGN KEY (`id_usuario_resultadoPublicar`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_partido_fkey` FOREIGN KEY (`id_partido`) REFERENCES `Partidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPartidos` ADD CONSTRAINT `UsuariosPartidos_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `Equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
