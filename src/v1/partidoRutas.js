import { Router } from "express";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";
import { partidoControlador } from "../controladores/partidosControlador.js";
import { esLiderDeEquipo } from "../middleware/esLiderDeEquipo.js";

export const partidoRouter = Router();

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
  .route("/")
  .get(
    autentifiacion(__ROL__.ESTUDIANTE),
    partidoControlador.obtenerPartidosPorUsuario
  )
  .post(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    partidoControlador.crearSolicitudLocal
  );

partidoRouter
  .route("/:id")
  .get(autentifiacion(__ROL__.TODOS), partidoControlador.obtenerUno)
  .patch(autentifiacion(__ROL__.TODOS), partidoControlador.actualizarUno)
  .delete(autentifiacion(__ROL__.ESTUDIANTE), partidoControlador.eliminarUno);
