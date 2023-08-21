import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";
import { __ESTADOS_PARTIDOS__ } from "../constantes/datosEstaticosDB.js";
import { errorJSON } from "../helper/index.js";
import {
  misPartidosWhere,
  partidoSelect,
  partidosPendientes,
} from "../querys/partidos.js";
import { equipo } from "./equipo.js";

class PartidoDB extends Database {
  obtenerSolicitudesPorEstado = async (estado) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: { id_estado: parseInt(estado) },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerPartidosProximosMaestros = async (estado, id_usuarioMaestro) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: {
          AND: [
            { id_estado: parseInt(estado) },
            { id_usuarioMaestro: parseInt(id_usuarioMaestro) },
          ],
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  verificarSiEquipoJuegaMaestros = async (estado, id) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: {
          AND: [{ id_estado: parseInt(estado) }, { id_equip: id }],
        },
        include: {
          usuariosPartidos: {
            select: {
              nombre: true,
            },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  obtenerMiembrosPartido = async (id) => {
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: { id: parseInt(id) },
        include: {
          usuarios: true,
          equipo_visitante: {
            select: {
              id: true,
              id_lider: true,
              lider: true,
              usuarios: {
                select: {
                  usuarios: true,
                },
              },
            },
          },
          estado: true,
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  //Mi DB :)
  obtenerPartidosPorUsuario = async (id_usuario) => {
    try {
      const equipos = await equipo.obtenerEquiposDelUsuario(id_usuario);
      const equipos_ids = equipos.map((equipo) => equipo.id);

      const partidos = await prisma.partidos.findMany({
        where: misPartidosWhere(equipos_ids, id_usuario),
        select: partidoSelect,
      });

      // if (!partidos.length)
      //   throw {
      //     status: "OK",
      //     data: { error: "No hay partidos", code: "pa1" },
      //   };

      return partidos;
    } catch (error) {
      throw error;
    }
  };

  obtenerSolicitudesPendientes = async () => {
    try {
      const partidos = await prisma.partidos.findMany({
        where: {
          id_estado: __ESTADOS_PARTIDOS__.PendienteMaestro.id,
        },
        select: partidosPendientes,
      });

      if (!partidos) return null;

      return partidos;
    } catch (error) {
      throw error;
    }
  };

  aceptarPartidoMaestro = async (id, id_estado, id_usuarioMaestro) => {
    try {
      const partido = await prisma.partidos.update({
        where: { id },
        data: { id_estado, id_usuarioMaestro },
        include: this.includes,
      });

      if (!partido) return null;

      return partido;
    } catch (error) {
      throw error;
    }
  };

  obtenerPartidosCoordinacion = async () => {
    try {
      const partidos = await prisma.partidos.findMany({
        where: {
          id_estado: __ESTADOS_PARTIDOS__.PendienteCoordinacion.id,
        },
        select: partidosPendientes,
      });

      return partidos;
    } catch (error) {
      throw error;
    }
  };

  rechazarPartidoCoordinacion = async (id) => {
    try {
      const partidoRechazado = await prisma.partidos.update({
        where: { id: +id },
        data: {
          id_estado: __ESTADOS_PARTIDOS__.Cancelado.id,
        },
      });

      if (!partidoRechazado) return null;

      return partidoRechazado;
    } catch (error) {
      throw error;
    }
  };

  posponerFecha = async (id, fecha) => {
    try {
      const partidoPospuesto = await prisma.partidos.update({
        where: { id: +id },
        data: {
          fecha,
          id_usuarioMaestro: null,
          id_estado: __ESTADOS_PARTIDOS__.PendienteMaestro.id,
        },
      });

      return partidoPospuesto;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  partidosZonaJuegosHabilitados = async (id_deporte) => {
    try {
      const zonaDeJuegos = prisma.zonaDejuego.findMany({
        where: {
          id_deporte,
        },
      });
      return zonaDeJuegos;
    } catch (error) {
      throw error;
    }
  };

  aceptarPartidoCoordinador = async (id, id_zona_juego) => {
    try {
      const partido = await prisma.partidos.update({
        where: { id: +id },
        data: {
          id_estado: __ESTADOS_PARTIDOS__.PendienteAsistencia.id,
          id_zona_juego,
        },
      });

      return partido;
    } catch (error) {
      throw error;
    }
  };

  obtenerPartidosCuidarMaestro = async (id_usuarioMaestro) => {
    try {
      const partidos = await prisma.partidos.findMany({
        where: {
          id_usuarioMaestro,
          OR: [
            { id_estado: __ESTADOS_PARTIDOS__.PendienteAsistencia.id },
            { id_estado: __ESTADOS_PARTIDOS__.EnJuego.id },
          ],
          // fecha: { gte: new Date() },
        },
        select: partidoSelect,
      });

      return partidos;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  colocarAsistencia = async (id, usuario) => {
    try {
      const partidoActualizar = await prisma.partidos.findFirst({
        where: {
          id: +id,
          OR: [
            { id_usuarioMaestro: usuario.id },
            { equipo_local: { id_lider: usuario.id } },
          ],
        },
      });

      const partido = await prisma.partidos.update({
        where: { id: partidoActualizar.id },
        data: {
          id_estado: __ESTADOS_PARTIDOS__.EnJuego.id,
        },
      });

      return partido;
    } catch (error) {
      throw error;
    }
  };
  cancelarPartido = async (id, usuario) => {
    try {
      const partidoActualizar = await prisma.partidos.findFirst({
        where: {
          id: +id,
          OR: [
            { id_usuarioMaestro: usuario.id },
            { equipo_local: { id_lider: usuario.id } },
          ],
        },
      });

      const partido = await prisma.partidos.update({
        where: {
          id: partidoActualizar.id,
        },

        data: {
          id_estado: __ESTADOS_PARTIDOS__.Cancelado.id,
        },
      });

      return partido;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  enviarResultados = async (data, id_estado, partido) => {
    try {
      let resultado;

      if (!partido.resultado) {
        resultado = await prisma.partidoResultado.create({
          data,
        });

        await prisma.partidos.update({
          where: {
            id: data.id_partido,
          },
          data: {
            id_estado,
          },
        });
      }

      if (!resultado) {
        resultado = await prisma.partidoResultado.update({
          where: {
            id_partido: partido.id,
          },
          data,
        });
      }

      return resultado;
    } catch (error) {
      throw error;
    }
  };

  aceptarResultados = async (id_partido) => {
    try {
      await prisma.partidoResultado.update({
        where: {
          id_partido: +id_partido,
        },
        data: {
          confirmado: true,
        },
      });

      const partido = await prisma.partidos.update({
        where: { id: +id_partido },
        data: {
          id_estado: __ESTADOS_PARTIDOS__.Finalizado.id,
        },
        select: partidoSelect,
      });
      return partido;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  cancelarResultado = async (id_partido, usuario) => {
    try {
      const partido = await prisma.partidos.findFirst({
        where: { id: +id_partido },
        select: partidoSelect,
      });

      console.log(partido.resultado);

      await prisma.partidoResultado.update({
        where: {
          id_partido: +id_partido,
          id_usuario_resultadoAceptar: usuario.id,
        },
        data: {
          id_usuario_resultadoAceptar: partido.resultado.id_usuario_resultadoPublicar,
          id_usuario_resultadoPublicar: partido.resultado.id_usuario_resultadoAceptar,
          enviadoListo: false,
        },
      });

      return partido;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const Partido = new PartidoDB("Partidos", {
  deporte: true,
  equipo_local: true,
  equipo_visitante: true,
  estado: true,
  usuarioMaestro: true,
  ZonaDejuego: true,
  resultado: true,
});

export { Partido };
