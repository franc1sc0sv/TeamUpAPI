import { Service } from "../clases/Servicios";
import { deporte } from "../db/deporte";

class DeporteService extends Service { }

const deporteServicio = new DeporteService(deporte)

export { deporteServicio }