import { Controller } from "../clases/Controlador.js";
import { nivelAcademicoServicio } from "../servicios/nivelAcademicoServicio.js";

class NivelAcademicoController extends Controller{

}

const nivelAcademicoControlador = new NivelAcademicoController({},{},nivelAcademicoServicio);

export { nivelAcademicoControlador }