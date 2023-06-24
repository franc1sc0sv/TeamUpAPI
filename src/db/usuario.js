import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

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
      const payload = await prisma[this.tabla].findMany({
        include: {
          nivelAcademico: {
            select: { nivelAcademico: true },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerUnUsuario = async (id) => {
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: { id: parseInt(id) },
        include: {
          nivelAcademico: {
            select: { nivelAcademico: true },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

const usuario = new UsuarioDB("Usuarios");

export { usuario };
