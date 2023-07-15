import { Database } from "../clases/BaseDeDatos.js";
import { __ESTADOS_PARTIDOS__ } from "../constantes/datosEstaticosDB.js";

class PartidoDB extends Database {
  obtenerSolicitudesPorEstado = async (estado) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: { id_estado: parseInt(estado) },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  obtenerPartidosProximosMaestros = async (estado, id_usuarioMaestro) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: {
          AND: [
            { id_estado: parseInt(estado) },
            { id_usuarioMaestro: parseInt(id_usuarioMaestro) },
          ],
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
  verificarSiEquipoJuegaMaestros = async (estado, id) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: {
          AND: [{ id_estado: parseInt(estado) }, { id_equip: id }],
        },
        include: {
          usuariosPartidos: {
            select: {
              nombre: true,
            },
          },
        },
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

const partido = new PartidoDB("Partidos");

export { partido };
