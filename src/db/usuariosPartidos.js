import { Database } from "../clases/BaseDeDatos.js";

class UsuariosPartidosDB extends Database {}

const usuariosPartidos = new UsuariosPartidosDB("UsuariosPartidos");

export { usuariosPartidos };
