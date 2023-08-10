import { prisma } from "../config/db.js";

class Database {
  constructor(tabla, includes) {
    //Al instanciar un objeto necesito el nombre de la tabla para usarlo con prisma
    this.tabla = tabla;
    this.includes = includes;
  }

  crearMuchos = async (data) => {
    try {
      //Payload es tipo la carga de datos, asi que de los datos que se crearon los almaceno en una constante
      const payload = await prisma[this.tabla].createMany({ data });

      //La funcion retorna esa carga de datos, osea el "objeto" creado
      //Objeto puede ser "deporte", "zona de juego", "maestro", etc

      //Retorno esa carga de datos para usarlo en el
      return payload;
    } catch (error) {
      //Si hay un error con prisma en ves mostrar el de por defecto muestro este para la api
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  crear = async (data) => {
    try {
      //Payload es tipo la carga de datos, asi que de los datos que se crearon los almaceno en una constante
      const payload = await prisma[this.tabla].create({ data });

      //La funcion retorna esa carga de datos, osea el "objeto" creado
      //Objeto puede ser "deporte", "zona de juego", "maestro", etc

      //Retorno esa carga de datos para usarlo en el
      return payload;
    } catch (error) {
      //Si hay un error con prisma en ves mostrar el de por defecto muestro este para la api
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  // Método para obtener todos los registros de la tabla especificada
  obtenerTodos = async () => {
    try {
      let payload;

      // Se obtienen todos los objetos de la tabla
      if (this.includes) {
        payload = await prisma[this.tabla].findMany({
          include: this.includes,
        });

        return payload;
      }

      payload = await prisma[this.tabla].findMany();
      return payload;
    } catch (error) {
      // Si hay un error al obtener los objetos, se lanza una excepción con un mensaje de error personalizado
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  // Método para obtener un registro específico de la tabla por su ID
  obtenerUno = async (id) => {
    try {
      // Se busca un objeto en la tabla que coincida con el ID proporcionado
      let payload;
      
      // Se obtienen todos los objetos de la tabla
      if (this.includes) {
        payload = await prisma[this.tabla].findFirst({
          where: { id: parseInt(id) },
          include: this.includes,
        });
        if(!payload) throw {status: 'FAILED', data: {error: 'No encontrado !'}}
        return payload;
      }

      payload = await prisma[this.tabla].findFirst({
        where: { id: parseInt(id) },
      });

    if(!payload) throw {status: 'FAILED', data: {error: 'No encontrado !'}}
      return payload;
    } catch (error) {
      // Si hay un error al obtener el objeto, se lanza una excepción con un mensaje de error personalizado
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  // Método para actualizar un registro existente en la tabla por su ID
  actualizarUno = async (data, id) => {
    try {
      // Se actualiza el objeto en la tabla con los nuevos datos proporcionados
      const payload = await prisma[this.tabla].update({
        where: { id: parseInt(id) },
        data,
      });

      // Retorna el objeto actualizado como resultado exitoso
      return payload;
    } catch (error) {
      console.log(error);
      // Si hay un error al actualizar el objeto, se lanza una excepción con un mensaje de error personalizado
      throw { status: "FAILED", data: { error: "Registro no existe !" } };
    }
  };

  // Método para eliminar un registro de la tabla por su ID
  eliminarUno = async (id) => {
    try {
      // Se elimina el objeto de la tabla que coincida con el ID proporcionado
      await prisma[this.tabla].delete({ where: { id: parseInt(id) } });

      // Se retorna 'true' para indicar que la eliminación fue exitosa
      return true;
    } catch (error) {
      // Si hay un error al eliminar el objeto, se lanza una excepción con un mensaje de error personalizado
      // console.log(error);
      throw { status: "FAILED", data: { error: "Registro no existe !" } };
    }
  };

  //
  encontrarPorObjeto = async (valueObject) => {
    try {
      const payload = await prisma[this.tabla].findFirst({
        where: valueObject,
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };

  //
  encontrarMuchosPorObjeto = async (valueObject) => {
    try {
      const payload = await prisma[this.tabla].findMany({
        where: valueObject,
      });
      return payload;
    } catch (error) {
      throw { status: "FAILED", data: { error: error?.message || error } };
    }
  };
}

export { Database };
