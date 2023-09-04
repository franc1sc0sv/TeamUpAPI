import { Router } from "express";
import { equipoControlador } from "../controladores/equipoControlador.js";

import { autentifiacion } from "../middleware/autentificacion.js";
import { esLiderDeEquipo } from "../middleware/esLiderDeEquipo.js";
import { esMiembroDeGrupo } from "../middleware/esMiembroDeGrupo.js";
import { esLiderOMiembroDeEquipo } from "../middleware/esLiderOMiembroDeEquipo.js";
import { __ROL__ } from "../constantes/roles.js";

import upload from "../utils/multer.js";

export const equipoRouter = Router();

equipoRouter.get(
  "/unirse/:token",
  autentifiacion(__ROL__.ESTUDIANTE),
  equipoControlador.unirseEquipoPorToken
);
equipoRouter.post("/buscar", equipoControlador.buscarEquipo);

equipoRouter
  .route("/")
  .post(autentifiacion(__ROL__.ESTUDIANTE), equipoControlador.crearEquipo)
  .get(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderOMiembroDeEquipo,
    equipoControlador.obtenerEquiposDelUsuario
  );

equipoRouter
  .route("/ObtenerEquiposCreados")
  .get(autentifiacion(__ROL__.ESTUDIANTE), equipoControlador.equiposCreados);

equipoRouter
  .route("/ObtenerEquiposRivales")
  .get(autentifiacion(__ROL__.ESTUDIANTE), equipoControlador.equiposRivales);

equipoRouter
  .route("/unirseEquipo")
  .post(autentifiacion(__ROL__.ESTUDIANTE), equipoControlador.unirseEquipo);

equipoRouter
  .route("/abandonarEquipo/:id")
  .delete(
    autentifiacion(__ROL__.ESTUDIANTE),
    esMiembroDeGrupo,
    equipoControlador.abandonarEquipo
  );

equipoRouter
  .route("/cambiarLider/:id")
  .patch(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    equipoControlador.cambiarLider
  );

equipoRouter
  .route("/:id")
  .get(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderOMiembroDeEquipo,
    equipoControlador.obtenerUnEquipo
  )
  .delete(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    equipoControlador.eliminarEquipo
  );

equipoRouter
  .route("/actualizarDatos/:id")
  .patch(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    equipoControlador.actualizarEquipoDatos
  );

equipoRouter
  .route("/actualizarAvatar/:id")
  .patch(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    upload.single("avatar"),
    equipoControlador.actualizarEquipoAvatar
  );

equipoRouter
  .route("/eliminarMiembro/:id")
  .patch(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    equipoControlador.eliminarMiembro
  );
