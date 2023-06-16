import { ZodError } from "zod";
import { mostrarZodError } from "../esquemas/utils.js";

class Controller {
  constructor(zodSchema, zodUpdateSchema, service) {
    // Constructor de la clase Controller
    // Se asignan las instancias de los esquemas Zod y el servicio
    this.zodSchema = zodSchema;
    this.zodUpdateSchema = zodUpdateSchema;
    this.service = service;
  }
  // Método para crear un nuevo registro
  crear = async (req, res) => {
    //Rawdata hace referencia como a datos en crudo (sin validar)
    const rawdata = req.body;
    try {
      // Se parsea el cuerpo de la solicitud utilizando el esquema ZodSchema
      const data = this.zodSchema.parse(rawdata);
      // Se llama al método "crear" del servicio para agregar el registro a la base de datos
      const payload = await this.service.crear(data);

      // Se retorna una respuesta exitosa con el código de estado 201 y los datos creados
      return res.status(201).json({ status: "OK", data: payload });
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        // Si ocurre un error de validación ZodError, se formatea y se envía como respuesta con el código de estado 400
        const zodError = mostrarZodError(error);

        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }

      // Si ocurre cualquier otro tipo de error, se envía una respuesta con el código de estado 500 y el error original
      return res.status(500).json(error);
    }
  };

  // Método para obtener todos los registros
  obtenerTodos = async (req, res) => {
    try {
      // Se llama al método "obtenerTodos" del servicio para obtener todos los registros de la base de datos
      const payload = await this.service.obtenerTodos();

      // Se retorna una respuesta exitosa con el código de estado 200 y los datos obtenidos
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      // Si ocurre un error, se envía una respuesta con el código de estado 500 y el error original
      return res.status(500).json(error);
    }
  };

  // Método para obtener un registro por su ID
  obtenerUno = async (req, res) => {
    try {
      const id = req.params.id;

      // Se llama al método "obtenerUno" del servicio para obtener un registro específico de la base de datos
      const payload = await this.service.obtenerUno(id);
      // Se retorna una respuesta exitosa con el código de estado 200 y el registro obtenido
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      // Si ocurre un error, se envía una respuesta con el código de estado 500 y el error original
      return res.status(500).json(error);
    }
  };

  // Método para actualizar un registro por su ID
  actualizarUno = async (req, res) => {
    const id = req.params.id;
    const rawdata = req.body;
    try {
      // Se parsea el cuerpo de la solicitud utilizando el esquema zodUpdateSchema
      const data = this.zodUpdateSchema.parse(rawdata);

      // Se llama al método "actualizarUno" del servicio para actualizar el registro en la base de datos
      const payload = await this.service.actualizarUno(data, id);

      // Se retorna una respuesta exitosa con el código de estado 200 y los datos actualizados
      return res.status(200).json({ status: "OK", data: payload });
    } catch (error) {
      if (error instanceof ZodError) {
        // Si ocurre un error de validación ZodError, se formatea y se envía como respuesta con el código de estado 400
        const zodError = mostrarZodError(error);

        return res
          .status(400)
          .json({ status: "FAILED", data: { error: zodError } });
      }

      // Si ocurre cualquier otro tipo de error, se envía una respuesta con el código de estado 500 y el error original
      return res.status(500).json(error);
    }
  };

  // Método para eliminar un registro por su ID
  eliminarUno = async (req, res) => {
    try {
      const id = req.params.id;

      // Se llama al método "eliminarUno" del servicio para eliminar el registro de la base de datos
      await this.service.eliminarUno(id);

      // Se retorna una respuesta exitosa con el código de estado 200 y un mensaje indicando que se ha eliminado el registro
      return res.status(200).json({ status: "OK", data: "Eliminado !" });
    } catch (error) {
      // Si ocurre un error, se envía una respuesta con el código de estado 500 y el error original
      return res.status(500).json(error);
    }
  };
}

export { Controller };
