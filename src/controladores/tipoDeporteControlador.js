import { Controller } from "../clases/Controlador.js";
import { tipoDeporteServicio } from "../servicios/tipoDeporteServicio.js";

class TipoDeporteController extends Controller{

}

const tipoDeporteController = new TipoDeporteController({},{},tipoDeporteServicio);

export { tipoDeporteController }