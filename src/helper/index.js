import { ZodError } from "zod";
import { mostrarZodError } from "../esquemas/utils.js";

export function zodResponse(res, error) {
  if (error instanceof ZodError) {
    const zodError = mostrarZodError(error);

    res
      .status(400)
      .json({ status: "FAILED", data: { error: zodError } });
    return true;
    }
    return false;
}


export function errorJSON(error,code){
  return {status: 'FAILED', data: {error, code}}
}

export function goodResponse(data){
  return {status: 'OK', data}
}

export const validarFecha = (stringFecha) => {
  const fecha = new Date(stringFecha);
  const fechaActual = new Date();
  let fechaMinima = new Date();

  // Si la fecha es sábado o domingo
  if (fecha.getDay() === 0 || fecha.getDay() === 6) {
    return { error: "No se permiten fechas en sábado o domingo." };
  }

  // Si la fecha actual no es viernes, ajustar la fecha mínima.
  if (fechaActual.getDay() !== 5) { // 5 representa el viernes
    fechaMinima.setDate(fechaActual.getDate() + 1); // Sumar 2 días para llegar al mínimo
  }

  // Si la fecha es menor que la fecha mínima, es inválida.
  if (fecha < fechaMinima) {
    return { error: "La fecha debe ser al menos 2 días después de la fecha actual." };
  }

  const horaMinuto = fecha.getHours() + (fecha.getMinutes() / 100);

  if (horaMinuto < 6 || horaMinuto >= 18) { // Cambiado a < 6 y >= 18 para excluir 6AM y 6PM
    return {
      error:
        "Formato inválido de fecha o no se encuentra entre las 6AM y las 6PM",
    };
  } else {
    return false;
  }
};
