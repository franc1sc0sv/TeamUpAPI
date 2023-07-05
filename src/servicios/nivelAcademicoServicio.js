import { Service } from "../clases/Servicios.js";
import { nivelAcademico } from "../db/NivelAcademico.js";

class NivelAcademicoServicio extends Service{

}

const nivelAcademicoServicio = new NivelAcademicoServicio(nivelAcademico);

export {nivelAcademicoServicio}