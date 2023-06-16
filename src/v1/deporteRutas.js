import { Router } from "express";
import { deporteControlador } from "../controladores/deporteControlador";
import { autentifiacion } from "../middleware/autentificacion";

const deporteRouter = Router()

deporteRouter.route("/")
    .get(deporteControlador.obtenerTodos)
    .post(autentifiacion(["COORDINADOR"]), deporteControlador.crear)


deporteRouter.route("/")
    .get(deporteControlador.obtenerUno)
    .put(autentifiacion(["COORDINADOR"]), deporteControlador.actualizarUno)
    .delete(autentifiacion(["COORDINADOR"]), deporteControlador.eliminarUno)
