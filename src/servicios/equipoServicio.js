import { Service } from "../clases/Servicios.js";
import { equipo } from "../db/equipo.js";
import { usuariosEquipos } from "../db/usuariosEquipos.js";
import bcrypt from "bcrypt";
import fs from "fs";
import sharp from "sharp";

const BASE_URL_IMAGES = "uploads/avatars/";
const DEFAULT_IMAGE_URL = "uploads/default/defaultAvatar.png";

const generarContrasena = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
  let contrasena = "";

  for (let i = 0; i < 8; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres.charAt(indice);
  }

  return contrasena;
};

class EquipoService extends Service {
  crearEquipo = async (data, usuario) => {
    try {
      const { nombre } = data;
      const equipo = await this.database.encontrarPorObjeto({
        nombre: nombre,
      });
      if (equipo) return { error: "El nombre actualmente esta ocupado" };

      const password_access = nombre + "-" + generarContrasena();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_access, salt);

      const mappedData = {
        nombre: nombre,
        avatar_url: DEFAULT_IMAGE_URL,
        password_access: hashedPassword,
        id_lider: usuario.id,
      };

      const payload = await this.database.crear(mappedData);
      payload.password_access = password_access;
      return payload;
    } catch (error) {
      throw error;
    }
  };
  unirseEquipo = async (data, usuario) => {
    const ERROR_PASSWORD = {
      error: "Error no existe el equipo o datos incorrectos",
    };
    try {
      const equipo = await this.database.encontrarPorObjeto({
        nombre: data.nombre,
      });

      if (!equipo) return ERROR_PASSWORD;

      const contraseñaValida = await bcrypt.compare(
        data.password_access,
        equipo.password_access
      );

      if (!contraseñaValida) return ERROR_PASSWORD;

      const mappedData = {
        id_equipo: equipo.id,
        id_usuarios: usuario.id,
      };

      //Verificar si ya pertenece al equipo
      const esMiembro = await usuariosEquipos.encontrarPorObjeto(mappedData);

      if (esMiembro)
        return { error: "Ya perteneces a este equipo(eres miembro)" };

      if (equipo.id_lider === usuario.id)
        return { error: "Ya perteneces a este equipo (eres lider)" };

      const payload = await usuariosEquipos.crear(mappedData);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  abandonarEquipo = async (data) => {
    try {
      const usuariosEquipo = await usuariosEquipos.encontrarPorObjeto(data);
      const { id } = usuariosEquipo;

      const payload = await usuariosEquipos.eliminarUno(id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  cambiarLider = async (data, id, equipoData) => {
    try {
      const mappedData = {
        id_equipo: id,
        id_usuarios: data.id_lider,
      };
      const esMiembro = await usuariosEquipos.encontrarPorObjeto(mappedData);
      if (!esMiembro)
        return { error: "El usuario no posee el rango de miembro" };

      // Eliminar al nuevo lider de la tabla de miembros
      await usuariosEquipos.eliminarUno(esMiembro.id);

      //Agregar a miembro el lider anterior
      const { id_lider } = equipoData;

      const newMiembrEquipoData = {
        id_equipo: id,
        id_usuarios: id_lider,
      };
      await usuariosEquipos.crear(newMiembrEquipoData);

      const payload = await this.database.actualizarUno(data, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  actualizarEquipo = async ({ data, file, id }) => {
    try {
      const mappedData = { ...data };

      if (data.password_access) {
        const salt = await bcrypt.genSalt(10);
        const newHasedPassword = await bcrypt.hash(data.password_access, salt);
        mappedData.password_access = newHasedPassword;
      }

      if (file) {
        const equipo = await this.database.obtenerUno(id);
        const { avatar_url } = equipo;
        // Como hay que eliminar la imagen anterior (si no es la default)
        if (
          avatar_url !== DEFAULT_IMAGE_URL &&
          !avatar_url.includes(file.originalname)
        ) {
          // Hay que borrar la imagen anterior
          fs.unlink(avatar_url, (err) => {
            if (err) {
              console.error(err);
              return { error: "Error al eliminar las imagenes" };
            }
          });
        }

        if (!avatar_url.includes(file.originalname)) {
          const URL_IMAGEN =
            BASE_URL_IMAGES + Date.now() + "-" + file.originalname;
          await sharp(file.buffer).resize(180, 180).toFile(URL_IMAGEN);
          mappedData.avatar_url = URL_IMAGEN;
        }
      }

      const payload = await this.database.actualizarUno(mappedData, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerUnEquipo = async ({ id, equiposUsuario }) => {
    {
      try {
        const equipo = equiposUsuario.filter((equipo) => equipo.id === id);

        if (!equipo?.length) {
          return { error: "No perteneces al equipo" };
        }

        return { equipo };
      } catch (error) {
        throw error;
      }
    }
  };
  eliminarMiembro = async ({ id_equipo, data }) => {
    try {
      const { id_usuarios } = data;
      await usuariosEquipos.eliminarMiembro({ id_equipo, id_usuarios });
      return true;
    } catch (error) {
      throw error;
    }
  };
}

const equipoServicio = new EquipoService(equipo);

export { equipoServicio };
