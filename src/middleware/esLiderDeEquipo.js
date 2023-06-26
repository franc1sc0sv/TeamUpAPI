import { equipo } from "../db/equipo.js";

export const esLiderDeEquipo = async (req, res, next) => {
  const idEquipo = req.params.id;
  const idUsuario = req.usuario.id;
  try {
    if (!idEquipo)
      return res.status(401).json({
        status: "FAILED",
        data: { error: "id requerido" },
      });
    const mappedData = {
      id: parseInt(idEquipo),
      id_lider: parseInt(idUsuario),
    };

    const payload = await equipo.encontrarPorObjeto(mappedData);
    if (payload) {
      req.equipo = payload;
      req.usuarioEquipo = mappedData;
      return next();
    }
    return res.status(401).json({
      status: "FAILED",
      data: { message: "No eres lider del equipo" },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Hubo un error de autentificacion",
    });
  }
};
