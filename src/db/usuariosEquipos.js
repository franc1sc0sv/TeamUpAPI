import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

class UsuariosEquiposDB extends Database {
  obtenerEquiposDelUsuario = async (data) => {
    try {
      const id = parseInt(data);
      const payload = await prisma[this.tabla].findFirst({
        where: {
          usuariosPartidos: {
            some: {
              id_lider: id,
              id_usuarios: id,
            },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  eliminarMiembro = async ({ id_usuarios, id_equipo }) => {
    try {
      await prisma[this.tabla].deleteMany({
        where: {
          id_equipo,
          id_usuarios,
        },
      });
      return true;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

const usuariosEquipos = new UsuariosEquiposDB("UsuariosEquipos");

export { usuariosEquipos };
