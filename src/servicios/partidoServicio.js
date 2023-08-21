import { Service } from "../clases/Servicios.js";
import { Partido } from "../db/partido.js";
import { equipo } from "../db/equipo.js";
import { usuariosPartidos } from "../db/usuariosPartidos.js";
import {
  __ESTADOS_PARTIDOS__,
  __TIPOS_DEPORTES__,
} from "../constantes/datosEstaticosDB.js";
import { prisma } from "../config/db.js";
import { deporte } from "../db/deporte.js";
import { usuariosEquipos } from "../db/usuariosEquipos.js";

const validarFecha = (stringFecha) => {
  const fecha = new Date(stringFecha);
  const fechaActual = new Date();

  console.log(fechaActual,fecha)

  //Si la fecha es de ayer
  if (fechaActual > fecha) return { error: "La fecha debe ser actual!" };

  const horaMinuto = fecha.getHours() + (fecha.getMinutes()/100)


  if (horaMinuto <= 6 && horaMinuto >= 16) {
    return {
      error:
        "Formato invalido de fecha o no se encuentra entre las 6AM y las 6PM",
    };
  } else {
    return false;
  }
};


import { __ROL__ } from "../constantes/roles.js";
import {
  partidoSelect,
  partidosEquiposLiderSelect,
} from "../querys/partidos.js";

const miembrosEquipo = ({ data }) => {
  const { usuarios } = data;
  const { lider } = data;
  const DatosUsuarios = usuarios?.map((jugador) => {
    const { usuarios } = jugador;
    return { id: usuarios.id, nombre: usuarios.nombre, rango: "miembro" };
  });

  DatosUsuarios.push({ id: lider.id, nombre: lider.nombre, rango: "lider" });

  return [...DatosUsuarios];
};

class PartidoService extends Service {
  //Estudiantes
  crearSolicitudLocal = async ({ data, jugadores, usuario }) => {
    try {
      const {
        id_deporte,
        id_equipo_local,
        id_equipo_visitante,
        descripcion,
        fecha,
        maestro_intermediario,
      } = data;

      const { id } = usuario;

      const equipoPayload = await equipo.encontrarPorObjeto({
        AND: [{ id: id_equipo_local }, { id_lider: id }],
      });

      if (!equipoPayload)
        throw {
          error: "El usuario no es lider del equipo",
        };

      if (validarFecha(fecha)) throw validarFecha(fecha);

      const { id_lider } = equipoPayload;

      const deportePayload = await deporte.obtenerUno(id_deporte);

      const { limiteJugadores, limiteJugadoresCambio, tipoDeporte } =
        deportePayload;

      const miembrosDelEquipo = await usuariosEquipos.encontrarMuchosPorObjeto({
        id_equipo: id_equipo_local,
      });

      miembrosDelEquipo.push({ id_usuarios: id_lider });

      const idUsuariosArreglo1 = new Set(
        miembrosDelEquipo
          .filter((item) => item.id_usuarios)
          .map((item) => item.id_usuarios)
      );

      const todosPertenecenAlEquipo = jugadores.every((item) =>
        idUsuariosArreglo1.has(item.id)
      );

      if (!todosPertenecenAlEquipo)
        return {
          error:
            "Alguno de los usuarios no pertence al equipo ta bonito postman",
        };

      const filteredjugadores = jugadores.filter((jugador) => {
        return jugador.estado !== null;
      });

      const mappedJugadores = filteredjugadores.map((jugador) => ({
        esReserva: jugador.estado === "titular" ? false : true,
        id_usuario: jugador.id,
        id_equipo: id_equipo_local,
      }));

      const mappedData = {
        descripcion: descripcion,
        fecha: new Date(fecha),
        id_estado: __ESTADOS_PARTIDOS__.PendienteRival.id,
        id_deporte: id_deporte,
        id_equipo_local: id_equipo_local,
        id_equipo_visitante: id_equipo_visitante,
        usuarios: {
          create: [...mappedJugadores],
        },
        maestro_intermediario,
      };

      const payload = await this.database.crear(mappedData);

      return payload;
    } catch (error) {
      throw error;
    }
  };
  aceptarSolicitudRival = async ({ jugadores, id_partido }) => {
    try {
      const partido = await prisma.partidos.findFirst({
        where: { id: +id_partido },
      });

      let id_estado = __ESTADOS_PARTIDOS__.PendienteMaestro.id;

      if (!partido.maestro_intermediario) {
        id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;
      }

      const filteredjugadores = jugadores.filter((jugador) => {
        return jugador.estado !== null;
      });

      const mappedJugadores = filteredjugadores.map((jugador) => ({
        esReserva: jugador.estado === "titular" ? false : true,
        id_usuario: jugador.id,
        id_equipo: partido.id_equipo_visitante,
        id_partido: parseInt(id_partido),
      }));

      const payload = await usuariosPartidos.crearMuchos(mappedJugadores);

      const partido_actualizado = await this.database.actualizarUno(
        { id_estado: id_estado },
        id_partido
      );

      return { ...payload, ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  cancelarSolicitudEstudiantes = async ({ id_partido }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.Cancelado.id;

      const partido_actualizado = await this.database.actualizarUno(
        { id_estado: id_estado },
        id_partido
      );

      return { ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  obtenerMiembrosPartido = async ({ id, usuario }) => {
    try {
      const partidos = await this.database.obtenerMiembrosPartido(id);
      const { equipo_visitante } = partidos;

      if (equipo_visitante.id_lider !== usuario.id)
        return { error: "Acceso denegado bro" };

      const plantillaEquipoLocal = partidos.usuarios;

      const equipo_visitante_miembros = miembrosEquipo({
        data: equipo_visitante,
      });

      const jugadoresValidos = equipo_visitante_miembros.map((usuario) => {
        const idUsuario = usuario.id;
        const jugadorUsado = plantillaEquipoLocal.some(
          (item) => item.id_usuario === idUsuario
        );

        return {
          ...usuario,
          jugadorYaUsado: jugadorUsado,
          estado: null,
        };
      });

      return jugadoresValidos;
    } catch (error) {
      throw error;
    }
  };
  //Maestros
  cuidarPartidoMaestro = async ({ id_partido, id_usuarioMaestro }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.PendienteCoordinacion.id;

      const partido_actualizado = await this.database.actualizarUno(
        { id_estado: id_estado, id_usuarioMaestro: id_usuarioMaestro },
        id_partido
      );

      return { ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  obtenerSolicitudesMaestros = async ({}) => {
    try {
      const estado = __ESTADOS_PARTIDOS__.PendienteMaestro.id;
      const payload = await this.database.obtenerSolicitudesPorEstado(estado);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerPartidosProximosMaestros = async ({ id_usuarioMaestro }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;
      const payload = await this.database.obtenerSolicitudesPorEstado(
        estado,
        id_usuarioMaestro
      );
      return payload;
    } catch (error) {
      throw error;
    }
  };
  verificarSiEquipoJuegaMaestros = async ({ data }) => {
    try {
      const equipoEncontrado = await equipo.encontrarPorObjeto(data);

      if (!equipoEncontrado) {
        throw { message: "El equipo no existe" };
      }

      const { id } = equipoEncontrado;
      const id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;

      const payload = await this.database.obtenerSolicitudesPorEstado(
        id_estado,
        id
      );

      if (!payload) {
        throw { message: "El equipo no tiene ninguun partido agendado" };
      }

      // const { fecha } = payload;
      // const fechaActual = new Date();

      // if (
      //   !(
      //     fecha.getFullYear() === fechaActual.getFullYear() &&
      //     fecha.getMonth() === fechaActual.getMonth() &&
      //     fecha.getDate() === fechaActual.getDate()
      //   )
      // ) {
      //   throw {
      //     message: `Este equipo no tiene el partido el dia de hoy - ${fecha}`,
      //   };
      // }

      return payload;
    } catch (error) {
      throw error;
    }
  };
  //Coordinacion
  aceptarSolicitudCoordinacion = async ({ id_partido, data }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;

      const partido_actualizado = await this.database.actualizarUno(
        { ...data, id_estado: id_estado },
        id_partido
      );

      return { ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  posponerSolicitudCoordinacion = async ({ id_partido, data }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.PendienteMaestro.id;

      const partido_actualizado = await this.database.actualizarUno(
        { ...data, id_estado: id_estado, id_usuarioMaestro: null },
        id_partido
      );

      return { ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  rechazarSolicitudCoordinacion = async ({ id_partido }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.Cancelado.id;

      const partido_actualizado = await this.database.actualizarUno(
        { id_estado: id_estado, id_usuarioMaestro: null },
        id_partido
      );

      return { ...partido_actualizado };
    } catch (error) {
      throw error;
    }
  };
  obtenerSolicitudesCoordinacion = async ({}) => {
    try {
      const estado = __ESTADOS_PARTIDOS__.PendienteCoordinacion.id;
      const payload = await this.database.obtenerSolicitudesPorEstado(estado);
      return payload;
    } catch (error) {
      throw error;
    }
  };

  //Falta tomar asistencia (Maestros)
  //Falta acordar resultados

  obtenerPartidosPorUsuario = async (id_usuario) => {
    try {
      const partidos = await Partido.obtenerPartidosPorUsuario(id_usuario);
      return partidos;
    } catch (error) {
      throw error;
    }
  };

  obtenerSolicitudesPendientes = async () => {
    try {
      const partidos = await Partido.obtenerSolicitudesPendientes();
      return partidos;
    } catch (error) {
      throw error;
    }
  };

  aceptarPartidoMaestro = async (id, id_usuarioMaestro) => {
    try {
      let id_estado = __ESTADOS_PARTIDOS__.PendienteCoordinacion.id;

      const partidoEncontrado = await prisma.partidos.findFirst({
        where: { id: +id },
        select: {
          deporte: {
            select: {
              tipoDeporte: true,
            },
          },
        },
      });

      const tipoDeporte = partidoEncontrado.deporte.tipoDeporte;

      //Dependiendo el tipo de deporte se saltan a ciertos estados
      if (tipoDeporte.skipCoordinacion) {
        id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;
      }

      const partidoModificado = await Partido.aceptarPartidoMaestro(
        +id,
        id_estado,
        id_usuarioMaestro
      );

      return partidoModificado;
    } catch (error) {
      throw error;
    }
  };

  obtenerPartidosCoordinacion = async () => {
    try {
      const partidos = await Partido.obtenerPartidosCoordinacion();
      return partidos;
    } catch (error) {
      throw error;
    }
  };

  rechazarSolicitudCoordinacion = async (id) => {
    try {
      const partidoRechazado = await Partido.rechazarPartidoCoordinacion(id);
      return partidoRechazado;
    } catch (error) {
      throw error;
    }
  };

  posponerFecha = async (id, fecha) => {
    try {
      const partido = await Partido.posponerFecha(id, new Date(fecha));
      return partido;
    } catch (error) {
      throw error;
    }
  };

  partidosZonaJuegosHabilitados = async (id) => {
    try {
      const partido = await Partido.obtenerUno(id);

      if (!partido) return null;

      const zonaDeJuegos = await Partido.partidosZonaJuegosHabilitados(
        partido.id_deporte
      );

      return zonaDeJuegos;
    } catch (error) {
      throw error;
    }
  };

  aceptarPartidoCoordinador = async (id, id_zona_juego) => {
    try {
      const partido = await Partido.aceptarPartidoCoordinador(
        id,
        id_zona_juego
      );
      return partido;
    } catch (error) {
      throw error;
    }
  };

  obtenerPartidosCuidarMaestro = async (id) => {
    try {
      const partidos = await Partido.obtenerPartidosCuidarMaestro(id);

      return partidos;
    } catch (error) {
      throw error;
    }
  };

  colocarAsistencia = async (id, usuario) => {
    try {
      const partidos = await Partido.colocarAsistencia(id, usuario);
      return partidos;
    } catch (error) {
      throw error;
    }
  };

  cancelarPartido = async (id, usuario) => {
    try {
      const partidos = await Partido.cancelarPartido(id, usuario);

      return partidos;
    } catch (error) {
      throw error;
    }
  };

  enviarResultados = async (data, usuario) => {
    try {
      //Datos con los resultados de los equipos nomas
      let partidoResultadoDatos = data;

      const rol = usuario.role;

      //Obtener todos los datos del partido
      const partido = await prisma.partidos.findFirst({
        where: { id: data.id_partido },
        select: partidosEquiposLiderSelect,
      });

      let partidoEstado = __ESTADOS_PARTIDOS__.EnJuego.id;

      if (rol == __ROL__.ESTUDIANTE && !partido.resultado) {
        //Obtener id del usuario lider local que propone resultado
        const id_usuario_resultadoPublicar = partido.equipo_local.lider.id;

        //Obtener id del usuario lider visitante que aceptar
        const id_usuario_resultadoAceptar = partido.equipo_visitante.lider.id;

        partidoResultadoDatos = {
          id_usuario_resultadoAceptar,
          id_usuario_resultadoPublicar,
          ...partidoResultadoDatos,
        };
      }

      if (rol == __ROL__.MAESTRO) {
        partidoEstado = __ESTADOS_PARTIDOS__.Finalizado.id;
      }
      const resultado = await Partido.enviarResultados(
        partidoResultadoDatos,
        partidoEstado,
        partido
      );
      return resultado;
    } catch (error) {
      throw error;
    }
  };

  aceptarResultados = async (id_partido, usuario) => {
    try {
      const partido = await Partido.aceptarResultados(id_partido, usuario);
      return partido;
    } catch (error) {
      throw error;
    }
  };

  cancelarResultado = async (id_partido, usuario) => {
    try {
      const partido = await Partido.cancelarResultado(id_partido, usuario);
      return partido;
    } catch (error) {
      throw error;
    }
  };
}

const partidoServicio = new PartidoService(Partido);

export { partidoServicio };
