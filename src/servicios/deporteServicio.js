import { Service } from "../clases/Servicios.js";
import { deporte } from "../db/deporte.js";

class DeporteService extends Service {}

const deporteServicio = new DeporteService(deporte);

export { deporteServicio };
