import { Service } from "../clases/Servicios.js";
import { tipoDeporte } from "../db/TipoDeporte.js";

class TipoDeporteServicio extends Service {}

const tipoDeporteServicio = new TipoDeporteServicio(tipoDeporte);

export { tipoDeporteServicio };
