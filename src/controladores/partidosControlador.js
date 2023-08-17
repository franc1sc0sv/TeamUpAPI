import { Controller } from "../clases/Controlador.js";
import { partidoServicio } from "../servicios/partidoServicio.js";

import {
  solicitudEsquema,
  solicitudJugadoresEsquema,
  aceptarSolicitudCoordinacionEsquema,
  posponerSolicitudEsquema,
  aceptarSolicitudVisitante,
  verificarSiEquipoJuegaMaestrosEsquema,
  posponerEsquema,
  aceptarPartido,
  partidoResultadoEsquema,
} from "../esquemas/partidoEsquemas.js";
import { errorJSON, goodResponse, zodResponse } from "../helper/index.js";

class PartidoController extends Controller {
  //Estudiantes
  crearSolicitudLocal = async (req, res) => {
    const rawdata = req.body;

    try {
      const { usuario } = req;
      const data = solicitudEsquema.parse(rawdata);
      const { jugadores: rawjugadores } = rawdata;

      const jugadores = rawjugadores.map((jugador) =>
        solicitudJugadoresEsquema.parse(jugador)
      );

      const payload = await this.service.crearSolicitudLocal({
        usuario,
        data,
        jugadores,
      });

      if (payload.error)
        return res
          .status(200)
          .json({ status: "OK", data: { error: payload.error } });

      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      if (zodResponse(res, error)) {
        return;
      }
      return res.status(500).json(error);
    }
  };
  aceptarSolicitudRival = async (req, res) => {
    const id_partido = req.params.id;
    const rawdata = req.body;
    try {
      if (!id_partido) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }

      const data = aceptarSolicitudVisitante.parse(rawdata);
      const jugadores = data.map((jugador) =>
        solicitudJugadoresEsquema.parse(jugador)
      );
      const payload = await this.service.aceptarSolicitudRival({
        jugadores,
        id_partido,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  cancelarSolicitudEstudiantes = async (req, res) => {
    const id_partido = req.params.id;
    try {
      if (!id_partido) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }
      const payload = await this.service.cancelarSolicitudEstudiantes({
        id_partido,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  //Maestros
  cuidarPartidoMaestro = async (req, res) => {
    const id_partido = req.params.id;
    try {
      if (!id_partido) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }
      const id_usuarioMaestro = usuarios.id;
      const payload = await this.service.cuidarPartidoMaestro({
        id_partido,
        id_usuarioMaestro,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  obtenerSolicitudesMaestros = async (req, res) => {
    try {
      const payload = await this.service.obtenerSolicitudesMaestros();
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  obtenerPartidosProximosMaestros = async (req, res) => {
    try {
      const id_usuarioMaestro = usuarios.id;
      const payload = await this.service.obtenerPartidosProximosMaestros({
        id_usuarioMaestro,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  // Como para  validar si el equipo juega hoy y los dejen salir a tiempo
  verificarSiEquipoJuegaMaestros = async (req, res) => {
    const rawdata = req.body;
    try {
      const data = verificarSiEquipoJuegaMaestrosEsquema.parse(rawdata);
      const payload = await this.service.verificarSiEquipoJuegaMaestros({
        data,
      });
      if (!payload) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "Hubo un error" } });
      }
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  //Coordinacion
  aceptarSolicitudCoordinacion = async (req, res) => {
    const id_partido = req.params.id;
    const rawdata = req.body;
    try {
      if (!id_partido) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }
      const data = aceptarSolicitudCoordinacionEsquema.parse(rawdata);
      const payload = await this.service.aceptarSolicitudCoordinacion({
        id_partido,
        data,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  posponerSolicitudCoordinacion = async (req, res) => {
    const id_partido = req.params.id;
    const rawdata = req.body;
    try {
      if (!id_partido) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }
      const data = posponerSolicitudEsquema.parse(rawdata);
      const payload = await this.service.posponerSolicitudCoordinacion({
        id_partido,
        data,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  obtenerSolicitudesCoordinacion = async (req, res) => {
    try {
      const payload = await this.service.obtenerSolicitudesCoordinacion();
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  //Falta tomar asistencia (Maestros)
  //Falta acordar resultados

  //Mis controladores :)
  obtenerPartidosPorUsuario = async (req, res) => {
    try {
      const partidos = await partidoServicio.obtenerPartidosPorUsuario(
        req.usuario.id
      );
      return res.status(200).json({ status: "OK", data: partidos });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  obtenerSolicitudesPendientes = async (req, res) => {
    try {
      const partidos = await partidoServicio.obtenerSolicitudesPendientes();

      if (!partidos)
        return res.status(404).json(errorJSON("No hay partidos !", "pa404"));

      return res.status(200).json(goodResponse(partidos));
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  aceptarPartidoMaestro = async (req, res) => {
    try {
      const { id } = req.params;
      const partidoActualizado = await partidoServicio.aceptarPartidoMaestro(
        id,
        req.usuario.id
      );
      return res.json(goodResponse(partidoActualizado));
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };

  obtenerPartidosCoordinacion = async (req, res) => {
    try {
      const partidos = await partidoServicio.obtenerPartidosCoordinacion();

      if (!partidos)
        return res
          .status(404)
          .json(errorJSON("No se han encontrados partidos"));

      return res.status(200).json(goodResponse(partidos));
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  aceptarPartidoMaestro = async (req, res) => {
    try {
      const { id } = req.params;
      const partidoActualizado = await partidoServicio.aceptarPartidoMaestro(
        id,
        req.usuario.id
      );
      return res.json(goodResponse(partidoActualizado));
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };

  obtenerPartidosCoordinacion = async (req, res) => {
    try {
      const partidos = await partidoServicio.obtenerPartidosCoordinacion();

      if (!partidos)
        return res
          .status(404)
          .json(errorJSON("No se han encontrados partidos"));

      return res.status(200).json(goodResponse(partidos));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  rechazarSolicitudCoordinacion = async (req, res) => {
    try {
      const { id } = req.params;

      const partido = await partidoServicio.rechazarSolicitudCoordinacion(id);

      return res.status(200).json(goodResponse(partido));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  posponerFecha = async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha } = posponerEsquema.parse(req.body);

      const partidoPospuesto = await partidoServicio.posponerFecha(id, fecha);

      return res.status(200).json(goodResponse(partidoPospuesto));
    } catch (error) {
      console.log(error);
      if (zodResponse(res, error)) {
        return;
      }
      return res.status(400).json(errorJSON(error));
    }
  };

  partidosZonaJuegosHabilitados = async (req, res) => {
    try {
      const { id } = req.params;
      const zonaDeJuegos = await partidoServicio.partidosZonaJuegosHabilitados(
        id
      );
      return res.status(200).json(goodResponse(zonaDeJuegos));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  aceptarPartidoCoordinador = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_zona_juego } = aceptarPartido.parse(req.body);
      const partido = await partidoServicio.aceptarPartidoCoordinador(
        id,
        id_zona_juego
      );

      return res.status(200).json(goodResponse(partido));
    } catch (error) {
      if (zodResponse(res, error)) return;

      return res.status(400).json(errorJSON(error));
    }
  };

  obtenerPartidosCuidarMaestro = async (req, res) => {
    try {
      const partidos = await partidoServicio.obtenerPartidosCuidarMaestro(
        req.usuario.id
      );
      return res.status(200).json(goodResponse(partidos));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  colocarAsistencia = async (req, res) => {
    try {
      const { id } = req.params;
      const partido = await partidoServicio.colocarAsistencia(id);
      return res.status(200).json(goodResponse(partido));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  cancelarPartido = async (req, res) => {
    try {
      const { id } = req.params;
      const partido = await partidoServicio.cancelarPartido(id);
      return res.status(200).json(goodResponse(partido));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  enviarResultados = async (req, res) => {
    try {
      const { id } = req.params;

      const datos = partidoResultadoEsquema.parse(req.body);

      const resultados = await partidoServicio.enviarResultados(
        {
          ...datos,
          id_partido: +id,
        },
        req.usuario.role
      );

      return res.status(200).json(goodResponse(resultados));
    } catch (error) {
      console.log(error);
      if (zodResponse(res, error)) {
        return;
      }
      return res.status(400).json(errorJSON("Hubo un error"));
    }
  };
}

const partidoControlador = new PartidoController({}, {}, partidoServicio);

export { partidoControlador };
