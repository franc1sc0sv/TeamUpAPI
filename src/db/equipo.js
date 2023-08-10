import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";
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
          nombre
        },
        select: {
          id: true,
          nombre: true,
          usuarios: {
            select: {
              usuarios: true
            }
          }
        }
      });
      
      if(!equipo) throw {status: 'FAILED', data: {error: 'Equipo no encontrado', code: 'eq1'}};

      const partidos = await prisma.partidos.findMany({
        where: {
          OR: [
            {id_equipo_local: equipo.id},
            {id_equipo_visitante: equipo.id},
          ]
        },
        select: partidoSelect
      })

      return {
        ...equipo,
        partidos
      };
      
    } catch (error) {
      throw error
    }
  };
}

const equipo = new EquiposDB("Equipos");

export { equipo };
