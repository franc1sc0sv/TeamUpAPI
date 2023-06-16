class Service {
  constructor(database) {
    // Al crear un servicio, se necesita la clase de Database
    // para tener acceso a agregar registros a la tabla
    this.database = database;
  }

  // Método para crear un registro en la tabla
  crear = async (data) => {
    try {
      // Payload es la carga de datos, es decir, si se crea algo en la base de datos, los datos se guardan en una constante
      const payload = await this.database.crear(data);
      // Retorno esos datos para usarlos en el Controlador / Controller
      return payload;
    } catch (error) {
      throw error;
    }
  };

  // Método para obtener todos los registros de la tabla
  obtenerTodos = async () => {
    try {
      const payload = await this.database.obtenerTodos();
      return payload;
    } catch (error) {
      throw error;
    }
  };

  // Método para obtener un registro específico de la tabla por su ID
  obtenerUno = async (id) => {
    try {
      const payload = await this.database.obtenerUno(id);
      return payload;
    } catch (error) {
      throw error;
    }
  };

  // Método para actualizar un registro existente en la tabla por su ID
  actualizarUno = async (data, id) => {
    try {
      const payload = await this.database.actualizarUno(data, id);
      return payload;
    } catch (error) {
      throw error;
    }
  };

  // Método para eliminar un registro de la tabla por su ID
  eliminarUno = async (id) => {
    try {
      await this.database.eliminarUno(id);
      return true;
    } catch (error) {
      throw error;
    }
  };
}

export { Service };
