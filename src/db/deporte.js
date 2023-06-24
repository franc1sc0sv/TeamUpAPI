import { Database } from "../clases/BaseDeDatos.js";

class DeporteDB extends Database {}

const deporte = new DeporteDB("Deporte");

export { deporte };
