import { Service } from "../clases/Servicios.js";
import { equipo, equipo } from "../db/equipo.js";
import { usuariosPartidos } from "../db/usuariosPartidos.js";
import { __ESTADOS_PARTIDOS__ } from "../constantes/datosEstaticosDB.js";

class PartidoService extends Service {
  //Estudiantes
  crearSolicitudLocal = async ({ data, jugadores }) => {
    try {
      data.id_estado = __ESTADOS_PARTIDOS__.PendienteRival.id;
      const payload = await this.database.crear(data);
      const { id } = payload;
      const MappedJugadores = jugadores.map((jugador) => {
        return { ...jugador, id_partido: id };
      });

      const payload2 = await usuariosPartidos.crearMuchos(MappedJugadores);

      return { ...payload, ...payload2 };
    } catch (error) {
      throw error;
    }
  };
  aceptarSolicitudRival = async ({ jugadores, id_partido }) => {
    try {
      const id_estado = __ESTADOS_PARTIDOS__.PendienteMaestro.id;
      const MappedJugadores = jugadores.map((jugador) => {
        return { ...jugador, id_partido: id_partido };
      });

      const payload = await usuariosPartidos.crearMuchos(MappedJugadores);

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
      const equipo = await equipo.encontrarPorObjeto({ data });

      if (!payload) {
        return { message: "El equipo no existe" };
      }

      const { id } = equipo;
      const id_estado = __ESTADOS_PARTIDOS__.PendienteAsistencia.id;

      const payload = await this.database.obtenerSolicitudesPorEstado(
        id_estado,
        id
      );

      if (!payload) {
        return { message: "El equipo no tiene ninguun partido agendado" };
      }

      const { fecha } = payload;
      const fechaActual = new Date();

      if (
        !(
          fecha.getFullYear() === fechaActual.getFullYear() &&
          fecha.getMonth() === fechaActual.getMonth() &&
          fecha.getDate() === fechaActual.getDate()
        )
      ) {
        return {
          message: `Este equipo no tiene el partido el dia de hoy - ${fecha}`,
        };
      }

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
}

const partidoServicio = new PartidoService(partido);

export { partidoServicio };
