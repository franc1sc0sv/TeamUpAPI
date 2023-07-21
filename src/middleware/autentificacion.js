import jwt from "jsonwebtoken";
import { usuario } from "../db/usuario.js";

const autentifiacion = (authorizedUsers) => {
  return async (req, res, next) => {
    try {
      //Primer paso obtengo el token de autentificacion
      const autorizacion = req.headers.authorization;
      //Verifico si existe y si es del tipo Bearer
      if (autorizacion && autorizacion.startsWith("Bearer")) {
        const token = autorizacion.split(" ")[1];
        const tokenVerificado = jwt.verify(token, process.env.JWT_SECRET);

        //Verifico si el usuario si exista
        const usuarioEncontradoPorId = await usuario.obtenerUno(
          tokenVerificado.id
        );

        //Miro si el usuarioEncontradoPorId pertenece a los usuarios permitidos
        if (authorizedUsers.includes(usuarioEncontradoPorId.role)) {
          req.usuario = usuarioEncontradoPorId;
          delete req.usuario.password;
          return next();
        }

        return res.status(401).json({
          status: "ACCESS DENIED",
          data: { message: "Acceso no permitido" },
        });
      }

      //Si no entra en el if, no hay token de autentificacion
      return res.status(401).json({
        status: "ACCESS DENIED",
        data: { message: "Acceso no permitido" },
      });
    } catch (error) {
      return res.status(400).json({
        status: "ACCESS DENIED",
        data: { message: "Hubo un error de autentificacion" },
      });
    }
  };
};

export { autentifiacion };
