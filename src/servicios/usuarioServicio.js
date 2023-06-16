import { Service } from "../clases/Servicios.js";
import { usuario } from "../db/usuario.js";
import bcrypt from "bcrypt";

class UsuarioService extends Service {
  crearCuenta = async (data) => {
    try {
      //Valiido si ya existe el usuario
      const { email } = data;
      const mismoUsuario = await this.database.obtenerUsuarioRepetido({
        email,
      });
      // Regreso un error si el usuario ya existe
      if (mismoUsuario) {
        return null;
      }
      //Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      //Si no, creo el usuario y lo retorno
      const nuevoUsuario = this.database.crear(data);
      return nuevoUsuario;
    } catch (error) {
      throw error;
    }
  };
  buscarUsuarioPorCredenciales = async (datos) => {
    try {
      const { email, password } = datos;

      const usuarioEncontrado =
        await this.database.buscarUsuarioPorCredenciales({
          email,
        });

      if (!usuarioEncontrado) return { error: "Usuario no encontrado" }

      const contraseñaValida = await bcrypt.compare(
        password,
        usuarioEncontrado.password
      );

      if (!contraseñaValida) return { error: "Credenciales incorrectas" }

      return usuarioEncontrado;
    } catch (error) {
      throw error;
    }
  };
  actualizarDatosUsuario = async (data, id) => {
    try {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
      const payload = await this.database.actualizarUno(data, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
}

const usuarioServicio = new UsuarioService(usuario);

export { usuarioServicio };
