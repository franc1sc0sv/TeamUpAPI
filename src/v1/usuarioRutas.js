import { Router } from "express";
import { usuarioControlador } from "../controladores/usuarioControlador.js";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";

const usuarioRouter = Router();

usuarioRouter
  .route("/")
  .get(usuarioControlador.obtenerTodos)
  .post(usuarioControlador.crearCuenta);

usuarioRouter.route("/:id").get(usuarioControlador.obtenerUno);

usuarioRouter
  .route("/actualizarDatos")
  .put(
    autentifiacion(__ROL__.TODOS),
    usuarioControlador.actualizarDatosUsuario
  );

usuarioRouter
  .route("/login")
  .post(usuarioControlador.buscarUsuarioPorCredenciales);

export { usuarioRouter };
