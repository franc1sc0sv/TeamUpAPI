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
          token: false,
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
