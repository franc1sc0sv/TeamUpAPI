import { deporteServicio } from "../servicios/deporteServicio.js";
import { Controller } from "../clases/Controlador.js";
import {
  deporteEsquema,
  deporteEsquemaActualizar,
} from "../esquemas/deporteEsquemas.js";
import { errorJSON, goodResponse } from "../helper/index.js";

class DeporteController extends Controller {
  deporteCanchas = async (req, res) => {
    try {
      const deportes = await deporteServicio.deporteCanchas();

      return res.status(200).json(goodResponse(deportes));
    } catch (error) {
      console.log(error);
      return res.status(400).json(errorJSON(error));
    }
  };
}

const deporteControlador = new DeporteController(
  deporteEsquema,
  deporteEsquemaActualizar,
  deporteServicio
);

export { deporteControlador };
