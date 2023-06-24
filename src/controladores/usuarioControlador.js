import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { mostrarZodError } from "../esquemas/utils.js";

import { Controller } from "../clases/Controlador.js";
import {
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioLogeoEsquema,
} from "../esquemas/usuariosEsquemas.js";
import { usuarioServicio } from "../servicios/usuarioServicio.js";

class UsuarioController extends Controller {
  obtenerUsuario = async (req, res) => {
    try {
      const { id } = req.usuario;
      // Se llama al método "obtenerUno" del servicio para obtener un registro específico de la base de datos
      const payload = await this.service.obtenerUsuario({ id });
      // Se retorna una respuesta exitosa con el código de estado 200 y el registro obtenido
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  crearCuenta = async (req, res) => {
    const rawdata = req.body;
    try {
      const data = this.zodSchema.parse(rawdata);
      const payload = await this.service.crearCuenta(data);

      if (!payload) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "El usuario ya existe" } });
      }

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
  buscarUsuarioPorCredenciales = async (req, res) => {
    try {
      const rawdata = req.body;
      const datosValidos = usuarioLogeoEsquema.parse(rawdata);
      const usuarioEncontrado = await this.service.buscarUsuarioPorCredenciales(
        datosValidos
      );

      if (usuarioEncontrado.error)
        return res
          .status(401)
          .json({ status: "FAILED", data: { error: usuarioEncontrado.error } });

      const token = jwt.sign(
        {
          id: usuarioEncontrado.id,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        ...usuarioEncontrado,
        token,
      });
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
  actualizarDatosUsuario = async (req, res) => {
    const { id } = req.usuario;
    const rawdata = req.body;
    try {
      const data = this.zodUpdateSchema.parse(rawdata);
      console.log(data);
      const payload = await this.service.actualizarDatosUsuario(data, id);
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
}

const usuarioControlador = new UsuarioController(
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioServicio
);

export { usuarioControlador };
