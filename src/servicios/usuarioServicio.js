import { Service } from "../clases/Servicios.js";
import { usuario } from "../db/usuario.js";
import bcrypt from "bcrypt";

class UsuarioService extends Service {
  crearCuentaEstudiante = async (data) => {
    try {
      const { email } = data;
      const mismoUsuario = await this.database.buscarUsuarioPorEmail({
        email,
      });

      if (mismoUsuario) {
        return null;
      }

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);

      const mappedData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        nivelAcademico: {
          create: [{ id_nivelAcademico: data.id_nivelAcademico }],
        },
      };

      const nuevoUsuario = this.database.crear(mappedData);
      return nuevoUsuario;
    } catch (error) {
      throw error;
    }
  };
  crearCuentaMaestro = async (data) => {
    try {
      const { email } = data;
      const mismoUsuario = await this.database.buscarUsuarioPorEmail({
        email,
      });
      if (mismoUsuario) return null;

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);

      //Mapear la data
      const mappedData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        role: "MAESTRO",
        nivelAcademico: {
          create: [{ id_nivelAcademico: data.id_nivelAcademico }],
        },
      };
      const nuevoUsuario = this.database.crear(mappedData);
      return nuevoUsuario;
    } catch (error) {
      throw error;
    }
  };
  buscarUsuarioPorCredenciales = async (datos) => {
    try {
      const { email, password } = datos;

      const usuarioEncontrado = await this.database.buscarUsuarioPorEmail({
        email,
      });

      if (!usuarioEncontrado) return { error: "Usuario no encontrado" };

      const contraseñaValida = await bcrypt.compare(
        password,
        usuarioEncontrado.password
      );

      if (!contraseñaValida) return { error: "Credenciales incorrectas" };

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
      if (data.id_nivelAcademico) {
        data = {
          ...data,
          nivelAcademico: {
            updateMany: {
              where: {
                id_estudiante: id,
              },
              data: {
                id_nivelAcademico: data.id_nivelAcademico,
              },
            },
          },
        };
        delete data.id_nivelAcademico;
      }
      console.log(data);

      const payload = await this.database.actualizarUno(data, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerUsuarios = async () => {
    try {
      const payload = await this.database.obtenerUsuarios();
      const mappedData = payload.map((data) => {
        return {
          nombre: data.nombre,
          email: data.email,
          role: data.role,
          nivelAcademico: data.nivelAcademico[0].nivelAcademico.nivel,
        };
      });

      return mappedData;
    } catch (error) {
      throw error;
    }
  };
  obtenerUnUsuario = async (id) => {
    try {
      const payload = await this.database.obtenerUnUsuario(id);

      if (!payload) return { error: "El usuario no existe" };

      const mappedData = {
        nombre: payload.nombre,
        email: payload.email,
        role: payload.role,
        nivelAcademico: payload.nivelAcademico[0].nivelAcademico.nivel,
      };

      return mappedData;
    } catch (error) {
      throw error;
    }
  };
}

const usuarioServicio = new UsuarioService(usuario);

export { usuarioServicio };
