import { Router } from "express";
import { deporteControlador } from "../controladores/deporteControlador.js";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";

export const deporteRouter = Router();

deporteRouter.get("/canchas", deporteControlador.deporteCanchas)

deporteRouter
  .route("/")
  .get(deporteControlador.obtenerTodos)
  .post(autentifiacion(__ROL__.COORDINADOR), deporteControlador.crear);

deporteRouter
  .route("/:id")
  .get(deporteControlador.obtenerUno)
  .patch(autentifiacion(__ROL__.COORDINADOR), deporteControlador.actualizarUno)
  .delete(autentifiacion(__ROL__.COORDINADOR), deporteControlador.eliminarUno);
