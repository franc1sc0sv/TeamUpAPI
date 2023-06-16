import { Router } from "express";
import { usuarioControlador } from "../controladores/usuarioControlador.js";
import { autentifiacion } from "../middleware/autentificacion.js";

const usuarioRouter = Router();

usuarioRouter
  .route("/")
  .get(usuarioControlador.obtenerTodos)
  .post(usuarioControlador.crearCuenta);

usuarioRouter.route("/:id").get(usuarioControlador.obtenerUno);

usuarioRouter
  .route("/actualizarDatos")
  .put(
    autentifiacion(["ESTUDIANTE", "MAESTRO", "COORDINADOR"]),
    usuarioControlador.actualizarDatosUsuario
  );

usuarioRouter
  .route("/login")
  .post(usuarioControlador.buscarUsuarioPorCredenciales);

export { usuarioRouter };
