import { Database } from "../clases/BaseDeDatos.js";

class UsuariosEquiposDB extends Database {
  obtenerEquiposDelUsuario = async (data) => {
    try {
      const id = parseInt(data);
      //id(usuario)
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
      await prisma[this.tabla].delete({
        where: {
          id_equipo: parseInt(id_equipo),
          id_usuarios: parseInt(id_usuarios),
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
