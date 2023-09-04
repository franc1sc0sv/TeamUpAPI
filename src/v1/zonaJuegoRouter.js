import { Router } from "express";
import { zonaJuegoControlador } from "../controladores/zonaJuegoControlador.js";
import { autentifiacion } from "../middleware/autentificacion.js";
import { __ROL__ } from "../constantes/roles.js";
import upload from "../utils/multer.js";

export const zonaJuegoRouter = Router();

zonaJuegoRouter
  .route("/")
  .get(
    autentifiacion(__ROL__.COORDINADOR),
    zonaJuegoControlador.obtenerZonasJuegos
  )
  .post(
    autentifiacion(__ROL__.COORDINADOR),
    upload.array("imagenes[]"), //Para que funque en axios
    zonaJuegoControlador.crearZonaJuego
  );

zonaJuegoRouter
  .route("/:id")
  .get(
    autentifiacion(__ROL__.COORDINADOR),
    zonaJuegoControlador.obtenerUnaZonaJuego
  )
  .delete(
    autentifiacion(__ROL__.COORDINADOR),
    zonaJuegoControlador.eliminarZonaJuego
  )
  .patch(
    autentifiacion(__ROL__.COORDINADOR),
    upload.array("imagenes[]"),
    zonaJuegoControlador.actualizarZonaJuego
  );
