-- CreateTable
CREATE TABLE `PartidoResultado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_partido` INTEGER NOT NULL,
    `id_usuario_resultadoAceptar` INTEGER NOT NULL,
    `id_usuario_resultadoPublicar` INTEGER NOT NULL,
    `resultado_local` INTEGER NOT NULL,
    `resultado_visitante` INTEGER NOT NULL,
    `confirmado` BOOLEAN NOT NULL,

    UNIQUE INDEX `PartidoResultado_id_partido_key`(`id_partido`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_partido_fkey` FOREIGN KEY (`id_partido`) REFERENCES `Partidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_usuario_resultadoAceptar_fkey` FOREIGN KEY (`id_usuario_resultadoAceptar`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartidoResultado` ADD CONSTRAINT `PartidoResultado_id_usuario_resultadoPublicar_fkey` FOREIGN KEY (`id_usuario_resultadoPublicar`) REFERENCES `Usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
