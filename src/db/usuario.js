import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

class UsuarioDB extends Database {
  obtenerUsuarioRepetido = async ({ email }) => {
    try {
      // Se busca un objeto en la tabla que coincida con el ID proporcionado
      const payload = await prisma[this.tabla].findFirst({
        where: { id: parseInt(id) },
      });
      return payload;
    } catch (error) {
      // Si hay un error al obtener el objeto, se lanza una excepción con un mensaje de error personalizado
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  buscarUsuarioPorCredenciales = async ({ email }) => {
    console.log(email);
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: { email },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

const usuario = new UsuarioDB("Usuarios");

export { usuario };
