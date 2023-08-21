import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";
import { __TIPOS_DEPORTES__ } from "../constantes/datosEstaticosDB.js";

class DeporteDB extends Database {
  deportesCanchas = async () => {
    try {
      const deportes = await prisma.deporte.findMany({
        where: {
          id_tipoDeporte: __TIPOS_DEPORTES__.CanchaRegulada.id,
        },
        include: {
          tipoDeporte: true,
        },
      });

      return deportes;
    } catch (error) {
      throw error;
    }
  };
}

const deporte = new DeporteDB("Deporte", { tipoDeporte: true });

export { deporte };
