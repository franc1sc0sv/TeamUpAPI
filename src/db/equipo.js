import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

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
}

const equipo = new EquiposDB("Equipos");

export { equipo };
