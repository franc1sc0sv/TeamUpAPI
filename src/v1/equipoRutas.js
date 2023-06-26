import { Router } from "express";
import { equipoControlador } from "../controladores/equipoControlador.js";

import { autentifiacion } from "../middleware/autentificacion.js";
import { esLiderDeEquipo } from "../middleware/esLiderDeEquipo.js";
import { esMiembroDeGrupo } from "../middleware/esMiembroDeGrupo.js";
import { esLiderOMiembroDeEquipo } from "../middleware/esLiderOMiembroDeEquipo.js";
import { __ROL__ } from "../constantes/roles.js";

import multer from "multer";

export const equipoRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

equipoRouter
  .route("/")
  .post(autentifiacion(__ROL__.ESTUDIANTE), equipoControlador.crearEquipo)
  .get(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderOMiembroDeEquipo,
    equipoControlador.obtenerEquiposDelUsuario
  );

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
  .put(
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
  .put(
    autentifiacion(__ROL__.ESTUDIANTE),
    esLiderDeEquipo,
    upload.single("avatar"),
    equipoControlador.actualizarEquipo
  );
