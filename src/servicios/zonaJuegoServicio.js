import { Service } from "../clases/Servicios.js";
import { zonaJuego } from "../db/zonaJuego.js";
import sharp from "sharp";
import fs from "fs";

import { imagesZonaJuegos } from "../db/imagenesZonaJuegos.js";

const BASE_URL_IMAGES = "uploads/zonaJuegos/";

class ZonaJuegoService extends Service {
  crearZonaJuego = async ({ data, files }) => {
    try {
      //Procesando las imagenes
      //Informacion formateada para usarla como query con prisma
      const mappedData = {
        nombre: data.nombre,
        id_deporte: data.id_deporte,
        imagenes: {
          create: [],
        },
      };

      for (const image of files) {
        const URL_IMAGES =
          BASE_URL_IMAGES + Date.now() + "-" + image.originalname;

        await sharp(image.buffer).resize(800, 600).toFile(URL_IMAGES);

        mappedData.imagenes.create.push({ imagen_url: URL_IMAGES });
      }
      const payload = await this.database.crear(mappedData);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerUnaZonaJuego = async (id) => {
    try {
      const payload = await this.database.obtenerUnaZonaJuego(id);
      return payload;
    } catch (error) {
      throw error;
    }
  };
  obtenerZonasJuegos = async () => {
    try {
      const payload = await this.database.obtenerZonasJuegos();
      return payload;
    } catch (error) {
      throw error;
    }
  };
  eliminarZonaJuego = async (id) => {
    try {
      const zonaJuego = await this.database.obtenerUnaZonaJuego(id);

      if (!zonaJuego) return { error: "Zona de juego no existe" };

      const { imagenes } = zonaJuego;
      imagenes.forEach((imagen) => {
        const { imagen_url } = imagen;
        fs.unlink(imagen_url, (err) => {
          if (err) {
            console.error(err);
            return { error: "Error al eliminar las imagenes" };
          }
        });
      });

      await this.database.eliminarUno(id);
      return true;
    } catch (error) {
      throw error;
    }
  };
  actualizarZonaJuego = async ({ data, files, id }) => {
    try {
      const zonaJuego = await this.database.obtenerUnaZonaJuego(id);

      const { imagenes } = zonaJuego;
      const imagen_eliminadas = data.imagen_eliminadas ?? [];

      if (!zonaJuego) return { error: "Zona de juego no existe" };

      //Las que se van eliminar
      const deletedImages = imagenes.filter((imagen_zona) =>
        imagen_eliminadas.includes(imagen_zona.id)
      );
      const imagenesRestantes = imagenes.filter(
        (imagen_zona) => !imagen_eliminadas.includes(imagen_zona.id)
      );

      if (imagenesRestantes + files.length <= 0) {
        throw { status: "FAILED", error: "Necesitas almenos una imagen !" };
      }

      deletedImages.forEach(async (imagen) => {
        const { id } = imagen;
        await imagesZonaJuegos.eliminarUno(id);
      });

      deletedImages.forEach((imagen) => {
        const { imagen_url } = imagen;
        fs.unlink(imagen_url, (err) => {
          if (err) {
            console.error(err);
            return { error: "Error al eliminar las imagenes" };
          }
        });
      });

      //Formateando la data
      const mappedData = { ...data };
      mappedData.imagenes = {};
      mappedData.imagenes.create = [];
      // Guardando imagenes
      for (const image of files) {
        const URL_IMAGES =
          BASE_URL_IMAGES + Date.now() + "-" + image.originalname;

        await sharp(image.buffer).resize(800, 600).toFile(URL_IMAGES);

        mappedData.imagenes.create.push({ imagen_url: URL_IMAGES });
      }

      delete mappedData.imagen_eliminadas;

      const payload = await this.database.actualizarUno(mappedData, id);
      return payload;
    } catch (error) {
      throw error;
    }

    //Array con las imagenes nuevas

    //Array con las imagenes viejas

    // Un filter si las imagenes viejas existen en las nuevas se eliminan si no se quedan
    //Las imagenes que se quedan son las que se van a eliminar
    //Y las nuevas son las que voy a guardar
    //Pero para optmizar algunas de esas imagenes que persistan no se les pase nada solo quiero un array con las imagenes nuevas que no se repitan y otro con las que voy a borrar
  };
}

const zonaJuegoServicio = new ZonaJuegoService(zonaJuego);
export { zonaJuegoServicio };
