import { usuariosEquipos } from "../db/usuariosEquipos.js";

export const esMiembroDeGrupo = async (req, res, next) => {
  const idEquipo = parseInt(req.params.id);
  const idUsuario = parseInt(req.usuario.id);
  try {
    if (!idEquipo)
      return res.status(401).json({
        status: "FAILED",
        data: { error: "id requerido" },
      });
    const mappedData = {
      id_equipo: idEquipo,
      id_usuarios: idUsuario,
    };
    const payload = await usuariosEquipos.encontrarPorObjeto(mappedData);

    if (payload) {
      req.usuarioEquipo = mappedData;
      return next();
    }
    return res.status(401).json({
      status: "FAILED",
      data: { message: "No perteneces a este equipo" },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Hubo un error de autentificacion",
    });
  }
};
