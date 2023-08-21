import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";
import { __ESTADOS_PARTIDOS__ } from "../constantes/datosEstaticosDB.js";

class UsuarioDB extends Database {
  buscarUsuarioPorEmail = async ({ email }) => {
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: { email },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerUsuarios = async () => {
    try {
      const payload = await prisma.usuarios.findMany({
        include: {
          nivelAcademico: true,
          token: false,
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerUnUsuario = async (id) => {
    try {
      const payload = await prisma.usuarios.findFirst({
        where: { id: parseInt(id) },
        include: { nivelAcademico: true, token: false },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerMaestros = async () => {
    try {
      const payload = await prisma.usuarios.findMany({
        where: { role: "MAESTRO" },
        include: {
          nivelAcademico: true,
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  estadisticasCoordinacion = async () => {
    try {
      const solicitudesPendientes = await prisma.partidos.count({
        where: {
          id_estado: __ESTADOS_PARTIDOS__.PendienteCoordinacion.id,
        },
      });

      const maestroCuidandoHoy = await prisma.partidos.count({
        where: {
          AND: [
            {
              NOT: {
                id_usuarioMaestro: null,
              },
            },
            {
              fecha: {
                gte: new Date(),
              },
            },
          ],
        },
      });

      const partidosRealizados = await prisma.partidos.count({
        where: {
          id_estado: __ESTADOS_PARTIDOS__.Finalizado.id,
        },
      });

      const deportes = await prisma.deporte.findMany({
        take: 3,
        select: {
          id: true,
          nombre: true,
          partidos: {
            select: {
              id: true,
            },
          },
        },
      });

      return {
        deportes,
        solicitudesPendientes,
        maestroCuidandoHoy,
        partidosRealizados,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  estadisticasEstudiante = async (id_usuario) => {
    try {
      const cantidadEquipos = await prisma.equipos.count({
        where: {
          OR: [{ id_lider: +id_usuario }, { usuarios: { some: {id_usuarios: +id_usuario} } }],
        },
      });

      const partidosCompletados = await prisma.partidos.count({
        where: {
          id_estado: __ESTADOS_PARTIDOS__.Finalizado.id,
          usuarios: { some: { id_usuario } },
        },
      });

      const solicitudesCreadas = await prisma.partidos.count({
        where: {
          equipo_local: { id_lider: id_usuario },
        },
      });

      return {
        cantidadEquipos,
        partidosCompletados,
        solicitudesCreadas,
      };
    } catch (error) {
      console.log(error)
      throw error;
    }
  };
}

const usuario = new UsuarioDB("Usuarios");

export { usuario };
