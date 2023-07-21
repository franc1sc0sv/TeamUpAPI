import { equipo } from "../db/equipo.js";

export const esLiderOMiembroDeEquipo = async (req, res, next) => {
  const id = parseInt(req.usuario.id);
  try {
    if (!id) {
      return res
        .status(400)
        .json({ status: "FAILED", data: { error: "id requerido" } });
    }

    const payload = await equipo.obtenerEquiposDelUsuario(id);

    if (payload) {
      const equipos = payload.map((equipo) =>
        equipo.id_lider === id
          ? { ...equipo, rango: "Lider" }
          : { ...equipo, rango: "Miembro" }
      );
      req.equiposUsuario = equipos;
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
