import { Database } from "../clases/BaseDeDatos.js";
import { prisma } from "../config/db.js";

class ZonaJuegoDB extends Database {
  obtenerUnaZonaJuego = async (id) => {
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: { id: parseInt(id) },
        include: { imagenes: true, deporte: true },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerZonasJuegos = async () => {
    try {
      const payload = await prisma[this.tabla].findMany({
        include: { imagenes: true, deporte: true },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

const zonaJuego = new ZonaJuegoDB("ZonaDejuego");

export { zonaJuego };
