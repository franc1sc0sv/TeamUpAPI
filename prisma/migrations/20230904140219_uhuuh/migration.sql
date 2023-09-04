-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ESTUDIANTE', 'MAESTRO', 'COORDINADOR');

-- CreateTable
CREATE TABLE "NivelAcademico" (
    "id" SERIAL NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "NivelAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDeporte" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "skipMaestro" BOOLEAN NOT NULL DEFAULT false,
    "skipCoordinacion" BOOLEAN NOT NULL DEFAULT false,
    "opcionalMaestro" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TipoDeporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartidosEstado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fase" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PartidosEstado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tokenEmail" TEXT NOT NULL DEFAULT '',
    "tokenVerificar" TEXT NOT NULL,
    "id_nivelAcademico" INTEGER NOT NULL,
    "role" "Rol" NOT NULL DEFAULT 'ESTUDIANTE',

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deporte" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "limiteJugadores" INTEGER NOT NULL,
    "limiteJugadoresCambio" INTEGER NOT NULL,
    "id_tipoDeporte" INTEGER NOT NULL,

    CONSTRAINT "Deporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonaDejuego" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_deporte" INTEGER NOT NULL,

    CONSTRAINT "ZonaDejuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagenesZonaDeJuego" (
    "id" SERIAL NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "id_zonaDeJuego" INTEGER NOT NULL,

    CONSTRAINT "ImagenesZonaDeJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "password_access" TEXT NOT NULL,
    "id_lider" INTEGER NOT NULL,
    "password_token" TEXT NOT NULL,
    "invitaciones_token" TEXT NOT NULL,

    CONSTRAINT "Equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariosEquipos" (
    "id" SERIAL NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "id_usuarios" INTEGER NOT NULL,

    CONSTRAINT "UsuariosEquipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partidos" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "id_usuarioMaestro" INTEGER,
    "id_deporte" INTEGER NOT NULL,
    "id_equipo_local" INTEGER NOT NULL,
    "id_equipo_visitante" INTEGER NOT NULL,
    "id_zona_juego" INTEGER,
    "maestro_intermediario" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Partidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartidoResultado" (
    "id" SERIAL NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "id_usuario_resultadoAceptar" INTEGER,
    "id_usuario_resultadoPublicar" INTEGER,
    "resultado_local" INTEGER NOT NULL,
    "resultado_visitante" INTEGER NOT NULL,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "enviadoListo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PartidoResultado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariosPartidos" (
    "id" SERIAL NOT NULL,
    "esReserva" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "id_equipo" INTEGER NOT NULL,

    CONSTRAINT "UsuariosPartidos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Equipos_password_token_key" ON "Equipos"("password_token");

-- CreateIndex
CREATE UNIQUE INDEX "Equipos_invitaciones_token_key" ON "Equipos"("invitaciones_token");

-- CreateIndex
CREATE UNIQUE INDEX "PartidoResultado_id_partido_key" ON "PartidoResultado"("id_partido");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_nivelAcademico_fkey" FOREIGN KEY ("id_nivelAcademico") REFERENCES "NivelAcademico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deporte" ADD CONSTRAINT "Deporte_id_tipoDeporte_fkey" FOREIGN KEY ("id_tipoDeporte") REFERENCES "TipoDeporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZonaDejuego" ADD CONSTRAINT "ZonaDejuego_id_deporte_fkey" FOREIGN KEY ("id_deporte") REFERENCES "Deporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagenesZonaDeJuego" ADD CONSTRAINT "ImagenesZonaDeJuego_id_zonaDeJuego_fkey" FOREIGN KEY ("id_zonaDeJuego") REFERENCES "ZonaDejuego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipos" ADD CONSTRAINT "Equipos_id_lider_fkey" FOREIGN KEY ("id_lider") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosEquipos" ADD CONSTRAINT "UsuariosEquipos_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "Equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosEquipos" ADD CONSTRAINT "UsuariosEquipos_id_usuarios_fkey" FOREIGN KEY ("id_usuarios") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "PartidosEstado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_usuarioMaestro_fkey" FOREIGN KEY ("id_usuarioMaestro") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_deporte_fkey" FOREIGN KEY ("id_deporte") REFERENCES "Deporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_equipo_local_fkey" FOREIGN KEY ("id_equipo_local") REFERENCES "Equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_equipo_visitante_fkey" FOREIGN KEY ("id_equipo_visitante") REFERENCES "Equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partidos" ADD CONSTRAINT "Partidos_id_zona_juego_fkey" FOREIGN KEY ("id_zona_juego") REFERENCES "ZonaDejuego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidoResultado" ADD CONSTRAINT "PartidoResultado_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "Partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidoResultado" ADD CONSTRAINT "PartidoResultado_id_usuario_resultadoAceptar_fkey" FOREIGN KEY ("id_usuario_resultadoAceptar") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidoResultado" ADD CONSTRAINT "PartidoResultado_id_usuario_resultadoPublicar_fkey" FOREIGN KEY ("id_usuario_resultadoPublicar") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPartidos" ADD CONSTRAINT "UsuariosPartidos_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "Partidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPartidos" ADD CONSTRAINT "UsuariosPartidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPartidos" ADD CONSTRAINT "UsuariosPartidos_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "Equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
