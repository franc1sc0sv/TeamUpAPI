import { deporteServicio } from "../servicios/deporteServicio.js";
import { Controller } from "../clases/Controlador.js";
import {
  deporteEsquema,
  deporteEsquemaActualzar,
} from "../esquemas/deporteEsquemas.js";

class DeporteController extends Controller {}

const deporteControlador = new DeporteController(
  deporteEsquema,
  deporteEsquemaActualzar,
  deporteServicio
);

export { deporteControlador };
