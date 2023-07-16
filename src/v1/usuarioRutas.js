import { Router } from "express";
import { usuarioControlador } from "../controladores/usuarioControlador.js";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";

const usuarioRouter = Router();

usuarioRouter
  .route("/maestro")
  .get(autentifiacion(__ROL__.COORDINADOR),usuarioControlador.obtenerMaestros)
  .post(
    autentifiacion(__ROL__.COORDINADOR),
    usuarioControlador.crearCuentaMaestro
  );

usuarioRouter
  .route("/login")
  .post(usuarioControlador.buscarUsuarioPorCredenciales);

usuarioRouter.get(
  "/perfil",
  autentifiacion(__ROL__.TODOS),
  usuarioControlador.obtenerPerfil
);

usuarioRouter
  .route("/")
  .get(usuarioControlador.obtenerUsuarios)
  .post(usuarioControlador.crearCuentaEstudiante)
  .put(
    autentifiacion(__ROL__.TODOS),
    usuarioControlador.actualizarDatosUsuario
  );

usuarioRouter.route("/:id")
.get(usuarioControlador.obtenerUnUsuario)
.delete(autentifiacion(__ROL__.COORDINADOR), usuarioControlador.eliminarUno);

export { usuarioRouter };
