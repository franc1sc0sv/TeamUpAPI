import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";
import { generarId } from "../helper/generarId.js";
import { partidoSelect } from "../querys/partidos.js";

class EquiposDB extends Database {
  obtenerEquiposDelUsuario = async (id) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: {
          OR: [{ id_lider: id }, { usuarios: { some: { id_usuarios: id } } }],
        },
        include: {
          lider: {
            select: {
              id: true,
              nombre: true,
            },
          },
          usuarios: {
            select: {
              id_usuarios: true,
              usuarios: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  buscarEquipo = async (nombre) => {
    try {
      const equipo = await prisma.equipos.findFirst({
        where: {
          nombre,
        },
        select: {
          id: true,
          nombre: true,
          usuarios: {
            select: {
              usuarios: true,
            },
          },
          lider: true,
        },
      });

      if (!equipo)
        throw {
          status: "FAILED",
          data: { error: "Equipo no encontrado", code: "eq1" },
        };

      const partidos = await prisma.partidos.findMany({
        where: {
          OR: [
            { id_equipo_local: equipo.id },
            { id_equipo_visitante: equipo.id },
          ],
        },
        select: partidoSelect,
      });

      return {
        ...equipo,
        partidos,
      };
    } catch (error) {
      throw error;
    }
  };

  estaEnEquipo = async (id_equipo, id_usuarios) => {
    try {
      const enEquipo = await prisma.usuariosEquipos.findFirst({
        where: {
          id_equipo,
          id_usuarios,
        },
      });
      console.log(id_equipo, id_usuarios);
      console.log(enEquipo);

      if (!enEquipo) {
        const esLider = await prisma.equipos.findFirst({
          where: {
            id: id_equipo,
            id_lider: id_usuarios,
          },
        });
        console.log(esLider);

        return esLider;
      }

      return enEquipo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  buscarEquipoPorToken = async (token) => {
    try {
      const equipo = await prisma.equipos.findFirst({
        where: {
          invitaciones_token: token,
        },
      });
      return equipo;
    } catch (error) {
      throw error;
    }
  };
  actualizarToken = async (id_equipo) => {
    try {
      const equipo = await prisma.equipos.update({
        where: {
          id: id_equipo,
        },
        data: {
          invitaciones_token: generarId(),
        },
      });

      return equipo;
    } catch (error) {
      throw error;
    }
  };
  unirseEquipo = async (id_equipo, id_usuarios) => {
    try {
      const usuarioEquipo = await prisma.usuariosEquipos.create({
        data: {
          id_equipo,
          id_usuarios,
        },
      });
      return usuarioEquipo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const equipo = new EquiposDB("equipos");

export { equipo };
