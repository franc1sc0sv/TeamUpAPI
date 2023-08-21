import { Service } from "../clases/Servicios.js";
import { deporte } from "../db/deporte.js";

class DeporteService extends Service {
    deporteCanchas = async () => { 
        try {
            const deportesCanchas = await deporte.deportesCanchas();
            return deportesCanchas;
        } catch (error) {
            throw error;
        }
     }
}

const deporteServicio = new DeporteService(deporte);

export { deporteServicio };
