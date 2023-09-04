import { Service } from "../clases/Servicios.js";
import { equipo } from "../db/equipo.js";
import { usuariosEquipos } from "../db/usuariosEquipos.js";
import bcrypt from "bcrypt";
import { generarId } from "../helper/generarId.js";
import cloudinary from "../utils/cloudinary.js";

class EquipoService extends Service {
  crearEquipo = async (data, usuario) => {
    try {
      const { nombre, password_access } = data;
      const equipo = await this.database.encontrarPorObjeto({
        nombre: nombre,
      });
      if (equipo) return { error: "El nombre actualmente esta ocupado" };

      // const result = await cloudinary.api.resource("Default/default_avatar");
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_access, salt);

      const mappedData = {
        nombre: nombre,
        avatar_url: process.env.URL_BACKEND+"/uploads/default/defaultAvatar.png",
        public_id: '',
        password_access: hashedPassword,
        id_lider: usuario.id,
        password_token: generarId(),
        invitaciones_token: generarId(),
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
        return { error: "Ya perteneces a este equipo (eres miembro)" };

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
  actualizarEquipoDatos = async ({ data, id }) => {
    try {
      const mappedData = { ...data };

      if (mappedData.new_password_access) {
        const { new_password_access } = mappedData;

        const salt = await bcrypt.genSalt(10);
        const newHasedPassword = await bcrypt.hash(new_password_access, salt);

        delete mappedData.new_password_access;

        mappedData.password_access = newHasedPassword;
      }

      const payload = await this.database.actualizarUno(mappedData, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  actualizarEquipoAvatar = async ({ file, id }) => {
    try {
      const mappedData = {};
      const equipo = await this.database.obtenerUno(id);
      const { avatar_url, public_id } = equipo;

      if (avatar_url !== "/uploads/default/defaultAvatar.png") {
        await cloudinary.uploader.destroy(public_id);
      }

      const IMAGEN = Date.now() + "-" + file.originalname.split(".")[0];

      const result = await cloudinary.uploader.upload(file.path, {
        public_id: IMAGEN,
        folder: "Avatars",
      });

      mappedData.avatar_url = result.url;
      mappedData.public_id = result.public_id;

      const payload = await this.database.actualizarUno(mappedData, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerUnEquipo = async ({ id, equiposUsuario, usuario }) => {
    {
      try {
        const equipo = equiposUsuario.filter((equipo) => equipo.id === id);

        if (!equipo?.length) {
          return { error: "No perteneces al equipo o no existe" };
        }

        if (equipo.id_lider != usuario.id) {
          delete equipo[0].password_token;
        }

        return equipo[0];
      } catch (error) {
        throw error;
      }
    }
  };
  equiposCreados = async ({ id_usuario }) => {
    try {
      const payload = await this.database.encontrarMuchosPorObjeto({
        id_lider: id_usuario,
      });

      return payload;
    } catch (error) {
      throw error;
    }
  };
  equiposRivales = async ({ id_usuario }) => {
    try {
      const payload = await this.database.encontrarMuchosPorObjeto({
        NOT: {
          id_lider: id_usuario,
        },
      });

      return payload;
    } catch (error) {
      throw error;
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
  buscarEquipo = async (nombre) => {
    try {
      const equipoEncontrado = await equipo.buscarEquipo(nombre);

      equipoEncontrado.usuarios = equipoEncontrado.usuarios.map(
        (usuario) => usuario.usuarios
      );

      return equipoEncontrado;
    } catch (error) {
      throw error;
    }
  };
  unirseEquipoPorToken = async (token, usuario) => {
    try {
      //Buscar si el token es valido
      const team = await equipo.buscarEquipoPorToken(token);
      if (!team) throw { error: "Equipo no encontrado" };

      //Checar si el usuario esta en el equipo
      const enEquipo = await equipo.estaEnEquipo(team.id, usuario.id);
      if (enEquipo) throw { error: "Usuario ya esta en equipo" };

      //Unir al usuario al equipo
      await equipo.unirseEquipo(team.id, usuario.id);

      //Reiniciar el token de actualizacion
      // const teamUpdated = await equipo.actualizarToken(team.id);
      //Me arrepenti y mejor que asi quedexd

      return team;
    } catch (error) {
      throw error;
    }
  };
  eliminarEquipo = async ({ id_equipo }) => {
    try {
      const equipo = await this.database.obtenerUno(id_equipo);
      if (!equipo) return { error: "El equipo no existe" };
      const { public_id } = equipo;
      if(public_id){
        await cloudinary.uploader.destroy(public_id);
      }
      await this.database.eliminarUno(id_equipo);
      return true;
    } catch (error) {
      throw error;
    }
  };
}

const equipoServicio = new EquipoService(equipo);

export { equipoServicio };
