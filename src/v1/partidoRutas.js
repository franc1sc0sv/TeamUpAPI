import { Router } from "express";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";
import { partidoControlador } from "../controladores/partidosControlador.js";
import { esLiderDeEquipo } from "../middleware/esLiderDeEquipo.js";

export const partidoRouter = Router();

partidoRouter.get(
  "/maestro/asistencia/:id",
  autentifiacion(__ROL__.MAESTRO),
  partidoControlador.colocarAsistencia
);
partidoRouter.get(
  "/maestro/cancelar/:id",
  autentifiacion(__ROL__.MAESTRO),
  partidoControlador.cancelarPartido
);

partidoRouter.get(
  "/maestro/cuidar",
  autentifiacion(__ROL__.MAESTRO),
  partidoControlador.obtenerPartidosCuidarMaestro
);

partidoRouter.post(
  "/coordinacion/aceptar/:id",
  autentifiacion(__ROL__.COORDINADOR),
  partidoControlador.aceptarPartidoCoordinador
);

partidoRouter.get(
  "/zonadejuegos/:id",
  autentifiacion(__ROL__.COORDINADOR),
  partidoControlador.partidosZonaJuegosHabilitados
);

partidoRouter.post(
  "/coordinacion/posponer/:id",
  autentifiacion(__ROL__.COORDINADOR),
  partidoControlador.posponerFecha
);

partidoRouter.get(
  "/coordinacion/rechazar/:id",
  autentifiacion(__ROL__.COORDINADOR),
  partidoControlador.rechazarSolicitudCoordinacion
);

partidoRouter.get(
  "/maestro/aceptar/:id",
  autentifiacion(__ROL__.MAESTRO),
  partidoControlador.aceptarPartidoMaestro
);

partidoRouter.get(
  "/pendientes",
  autentifiacion(__ROL__.MAESTRO),
  partidoControlador.obtenerSolicitudesPendientes
);

partidoRouter.get(
  "/coordinacion/pendientes",
  autentifiacion(__ROL__.COORDINADOR),
  partidoControlador.obtenerPartidosCoordinacion
);

partidoRouter
  .route("/:id")
  .post(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    partidoControlador.crearSolicitudLocal
  )
  .get(autentifiacion(__ROL__.TODOS), partidoControlador.obtenerUno)
  .patch(autentifiacion(__ROL__.TODOS), partidoControlador.actualizarUno)
  .delete(autentifiacion(__ROL__.ESTUDIANTE), partidoControlador.eliminarUno);

partidoRouter
  .route("/")
  .get(
    autentifiacion(__ROL__.ESTUDIANTE),
    partidoControlador.obtenerPartidosPorUsuario
  );
