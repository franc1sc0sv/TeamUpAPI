import { deporteServicio } from "../servicios/deporteServicio";
import { Controller } from "../clases/Controlador";
import { deporteEsquema, deporteEsquemaActualzar } from "../esquemas/deporteEsquemas";

class DeporteController extends Controller { }

const deporteControlador = new DeporteController(deporteEsquema, deporteEsquemaActualzar, deporteServicio)

export { deporteControlador }