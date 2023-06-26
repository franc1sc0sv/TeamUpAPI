import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

class EquiposDB extends Database {}

const equipo = new EquiposDB("Equipos");

export { equipo };
