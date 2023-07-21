import { ZodError } from "zod";
import { Controller } from "../clases/Controlador.js";
import { equipoServicio } from "../servicios/equipoServicio.js";
import { mostrarZodError } from "../esquemas/utils.js";
import {
  crearEquipoEsquema,
  actualizarEquipoEsquema,
  unirseEquipoEsquema,
  cambiarLiderEsquema,
  eliminarMiembro,
} from "../esquemas/equipoEsquemas.js";

function eliminarPropiedadesVacias(objeto) {
  const nuevoObjeto = {};

  for (let propiedad in objeto) {
    if (
      objeto[propiedad] !== null &&
      objeto[propiedad] !== undefined &&
      objeto[propiedad] !== ""
    ) {
      nuevoObjeto[propiedad] = objeto[propiedad];
    }
  }
  delete nuevoObjeto.id;
  const estaVacio = Object.entries(nuevoObjeto).length === 0;

  return !estaVacio ? nuevoObjeto : false;
}

class EquipoController extends Controller {
  crearEquipo = async (req, res) => {
    const rawdata = req.body;
    const { usuario } = req;
    try {
      const datosValidos = this.zodSchema.parse(rawdata);
      const payload = await this.service.crearEquipo(datosValidos, usuario);

      if (payload.error)
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });
      console.log(payload);

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
  unirseEquipo = async (req, res) => {
    const rawdata = req.body;
    const { usuario } = req;
    try {
      const datosValidos = unirseEquipoEsquema.parse(rawdata);
      const payload = await this.service.unirseEquipo(datosValidos, usuario);

      if (payload.error)
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });

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
  abandonarEquipo = async (req, res) => {
    try {
      const { usuarioEquipo } = req;
      await this.service.abandonarEquipo(usuarioEquipo);

      return res
        .status(201)
        .json({ status: "OK", data: "Has abandonado el grupo correctamente" });
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
  cambiarLider = async (req, res) => {
    const id = parseInt(req.params.id);
    const { equipo } = req;

    const rawdata = req.body;
    try {
      const data = cambiarLiderEsquema.parse(rawdata);
      const payload = await this.service.cambiarLider(data, id, equipo);
      return res.status(200).json({ status: "OK", data: payload });
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
  actualizarEquipoDatos = async (req, res) => {
    const rawdata = req.body;
    const id = req.body.id;
    try {
      if (!id) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }
      const emptyDataFilter = eliminarPropiedadesVacias(rawdata);

      if (!emptyDataFilter) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "Error con los datos" } });
      }

      const data = this.zodUpdateSchema.parse(emptyDataFilter);
      const payload = await this.service.actualizarEquipoDatos({
        data,
        id,
      });

      if (payload.error) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });
      }
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
  actualizarEquipoAvatar = async (req, res) => {
    const { file } = req;
    const id = req.params.id;
    try {
      if (!id) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }

      const payload = await this.service.actualizarEquipoAvatar({ file, id });
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
  obtenerEquiposDelUsuario = async (req, res) => {
    try {
      const { equiposUsuario } = req;
      return res.status(200).json({ status: "OK", data: equiposUsuario });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  obtenerUnEquipo = async (req, res) => {
    const id = parseInt(req.params.id);
    const { equiposUsuario } = req;

    try {
      if (!id) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "id requerido" } });
      }

      const payload = await this.service.obtenerUnEquipo({
        id,
        equiposUsuario,
      });
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  eliminarMiembro = async (req, res) => {
    const { equiposUsuario } = req;
    const rawdata = req.body;

    try {
      const data = eliminarMiembro.parse(rawdata);
      const id_equipo = equiposUsuario.id;
      await this.service.eliminarMiembro({ id_equipo, data });
      return res
        .status(200)
        .json({ status: "OK", data: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
}

const equipoControlador = new EquipoController(
  crearEquipoEsquema,
  actualizarEquipoEsquema,
  equipoServicio
);

export { equipoControlador };
