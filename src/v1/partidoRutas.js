import { Router } from "express";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";
import { partidoControlador } from "../controladores/partidosControlador.js";
import { esLiderDeEquipo } from "../middleware/esLiderDeEquipo.js";

export const deporteRouter = Router();

deporteRouter
  .route("/")
  .get(partidoControlador.obtenerTodos)
  .post(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    partidoControlador.crearSolicitudLocal
  );

deporteRouter
  .route("/")
  .get(partidoControlador.obtenerUno)
  .patch(autentifiacion(__ROL__.TODOS), partidoControlador.actualizarUno)
  .delete(autentifiacion(__ROL__.ESTUDIANTE), partidoControlador.eliminarUno);
