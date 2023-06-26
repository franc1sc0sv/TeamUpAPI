import { Database } from "../clases/BaseDeDatos.js";

class UsuariosEquiposDB extends Database {}

const usuariosEquipos = new UsuariosEquiposDB("UsuariosEquipos");

export { usuariosEquipos };
