import { Controller } from "../clases/Controlador.js";
import { zonaJuegoServicio } from "../servicios/zonaJuegoServicio.js";
import {
  zonaJuegosEsquemas,
  zonaJuegosEsquemasActualizar,
} from "../esquemas/zonaJuegosEsquemas.js";
import { ZodError } from "zod";
import { mostrarZodError } from "../esquemas/utils.js";

class ZonaJuegoController extends Controller {
  crearZonaJuego = async (req, res) => {
    const { files } = req;
    const rawdata = req.body;
    try {
      const data = this.zodSchema.parse(rawdata);
      if (!files?.length) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "Imagenes requeridas" } });
      }
      const payload = await this.service.crearZonaJuego({ data, files });
      return res.status(201).json({ status: "OK", data: payload });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = mostrarZodError(error);
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }
      return res.status(500).json(error);
    }
  };
  obtenerUnaZonaJuego = async (req, res) => {
    const id = req.params.id;

    try {
      if (!id) {
        return res
          .status(200)
          .json({ status: "FAILED", data: { error: "ID requerido" } });
      }
      const payload = await this.service.obtenerUnaZonaJuego(id);

      if (!payload?.length) {
        return res.status(200).json({
          status: "FAILED",
          data: { error: "La zona de juego no existe" },
        });
      }

      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  obtenerZonasJuegos = async (req, res) => {
    try {
      const payload = await this.service.obtenerZonasJuegos();
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  eliminarZonaJuego = async (req, res) => {
    const { id } = req.params;
    try {
      const data = await this.service.eliminarZonaJuego(id);

      if (data.error) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: data.error } });
      }

      return res.status(200).json({ status: "OK", data: "Eliminado !" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  actualizarZonaJuego = async (req, res) => {
    const { files } = req;
    const rawdata = req.body;
    const id = req.params.id;
    try {
      const data = this.zodUpdateSchema.parse(rawdata);

      if (!id) {
        return res
          .status(200)
          .json({ status: "FAILED", data: { error: "ID requerido" } });
      }
      console.log(files);

      if (!files?.length) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "Imagenes requeridas" } });
      }
      const payload = await this.service.actualizarZonaJuego({
        data,
        files,
        id,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        const zodError = mostrarZodError(error);
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }
      return res.status(500).json(error);
    }
  };
}

const zonaJuegoControlador = new ZonaJuegoController(
  zonaJuegosEsquemas,
  zonaJuegosEsquemasActualizar,
  zonaJuegoServicio
);

export { zonaJuegoControlador };
