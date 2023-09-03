import { Controller } from "../clases/Controlador.js";
import { usuarioServicio } from "../servicios/usuarioServicio.js";

import {
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioLogeoEsquema,
  emailEsquema,
  changePasswordEsquema,
} from "../esquemas/usuariosEsquemas.js";

import { ZodError } from "zod";
import { mostrarZodError } from "../esquemas/utils.js";
import jwt from "jsonwebtoken";
import { errorJSON, goodResponse } from "../helper/index.js";

class UsuarioController extends Controller {
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
      const data = usuarioEsquemaActualizar.parse(rawdata);
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

  crearCuentaEstudiante = async (req, res) => {
    const rawdata = req.body;
    try {
      const data = usuarioEsquema.parse(rawdata);
      const payload = await this.service.crearCuentaEstudiante(data);

      if (!payload) {
        return res.status(400).json({
          status: "FAILED",
          data: { error: "correo_existente" },
        });
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

  crearCuentaMaestro = async (req, res) => {
    const rawdata = req.body;
    try {
      const data = usuarioEsquema.parse(rawdata);
      const payload = await this.service.crearCuentaMaestro(data);

      if (!payload) {
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: "usuario_existente" } });
      }

      return res.status(201).json({ status: "OK", data: payload });
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

  obtenerUsuarios = async (req, res) => {
    try {
      const payload = await this.service.obtenerUsuarios();
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  obtenerUnUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const payload = await this.service.obtenerUnUsuario(id);
      if (payload.error)
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });

      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  obtenerPerfil = async (req, res) => {
    return res.status(200).json({ status: "OK", data: req.usuario });
  };

  obtenerMaestros = async (req, res) => {
    try {
      const payload = await usuarioServicio.obtenerMaestros();
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  restaurarContraseña = async (req, res) => {
    try {
      const rawdata = req.body;
      const data = emailEsquema.parse(rawdata);
      const payload = await this.service.restaurarContraseña(data);

      if (payload.error)
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });

      return res.status(200).json({
        status: "OK",
        data: payload,
      });
    } catch (error) {
      console.log(error);
      if (error.code && error.command) {
        return res.status(400).json({
          status: "FAILED",
          data: { error: "error_correo" },
        });
      }
      if (error instanceof ZodError) {
        const zodError = mostrarZodError(error);

        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }
      return res.status(500).json(error);
    }
  };

  changePassword = async (req, res) => {
    try {
      const rawdata = req.body;
      const data = changePasswordEsquema.parse(rawdata);
      const payload = await this.service.changePassword(data);

      if (payload.error)
        return res
          .status(400)
          .json({ status: "FAILED", data: { error: payload.error } });

      return res.status(200).json({
        status: "OK",
        data: payload,
      });
    } catch (error) {
      console.log(error);
      if (error.code && error.command) {
        return res.status(400).json({
          status: "FAILED",
          data: { error: "error_correo" },
        });
      }
      if (error instanceof ZodError) {
        const zodError = mostrarZodError(error);

        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }
      return res.status(500).json(error);
    }
  };

  estadisticasCoordinacion = async (req, res) => {
    try {
      const estadisicas = await usuarioServicio.estadisticasCoordinacion();
      return res.status(200).json(goodResponse(estadisicas));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };

  verificarToken = async (req,res) => { 
    try {
      await usuarioServicio.verificarToken(req.params.token ?? '');
      
      return res.status(200).json(goodResponse({message: "Token Valido !"}))
    } catch (error) {
      console.log(error)
      return res.status(500).json(errorJSON({message: "Token invalido"}))
    }
   }

  estadisticasEstudiante = async (req, res) => {
    try {
      const estadisicas = await usuarioServicio.estadisticasEstudiante(
        req.usuario.id
      );
      return res.status(200).json(goodResponse(estadisicas));
    } catch (error) {
      return res.status(400).json(errorJSON(error));
    }
  };
}

const usuarioControlador = new UsuarioController(
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioServicio
);

export { usuarioControlador };
