import { equipo } from "../db/equipo.js";
import { usuariosEquipos } from "../db/usuariosEquipos.js";

export const esLiderOMiembroDeEquipo = async (req, res, next) => {
  const idUsuario = parseInt(req.usuario.id);
  try {
    // Es miembro
    const mappedDataMiembro = {
      id_usuarios: idUsuario,
    };

    // Es Lider
    const mappedDataLider = {
      id_lider: idUsuario,
    };

    const payloadMiembro = await usuariosEquipos.encontrarMuchosPorObjeto(
      mappedDataMiembro
    );
    const payloadLider = await equipo.encontrarMuchosPorObjeto(mappedDataLider);

    if (payloadMiembro || payloadLider) {
      return next();
    }

    return res.status(401).json({
      status: "FAILED",
      data: { message: "No perteneces al equipo" },
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Hubo un error de autentificacion",
    });
  }
};
