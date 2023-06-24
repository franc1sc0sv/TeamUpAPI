import { Database } from "../clases/BaseDeDatos.js";

class Images extends Database {}

const imagesZonaJuegos = new Images("ImagenesZonaDeJuego");

export { imagesZonaJuegos };
