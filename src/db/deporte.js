import { Database } from "../clases/BaseDeDatos";

class DeporteDB extends Database { }

const deporte = new DeporteDB("Deporte")

export { deporte }