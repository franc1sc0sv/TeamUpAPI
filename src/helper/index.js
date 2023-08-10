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