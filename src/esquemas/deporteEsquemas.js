import { z } from "zod";

export const deporteEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  descripcion: z
    .string({ required_error: "descripcion_requerida" })
    .nonempty("descripcion_vacia"),
  limiteJugadores: z
    .string({ required_error: "limiteJugadores_requerido" })
    .nonempty("limiteJugadores_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "limiteJugadores_requerido" })),
  limiteJugadoresCambio: z
    .string({ required_error: "limiteJugadoresCambio_requerido" })
    .nonempty("limiteJugadoresCambio_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "limiteJugadoresCambio_requerido" })),
  id_tipoDeporte: z
    .string({ required_error: "id_tipoDeporte_requerido" })
    .nonempty("id_tipoDeporte_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "id_tipoDeporte_requerido" })),
});

export const deporteEsquemaActualizar = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio")
    .optional(),
  descripcion: z
    .string({ required_error: "descripcion_requerida" })
    .nonempty("descripcion_vacia")
    .optional(),
  limiteJugadores: z
    .string({ required_error: "limiteJugadores_requerido" })
    .nonempty("limiteJugadores_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "limiteJugadores_requerido" }))
    .optional(),
  limiteJugadoresCambio: z
    .string({ required_error: "limiteJugadoresCambio_requerido" })
    .nonempty("limiteJugadoresCambio_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "limiteJugadoresCambio_requerido" }))
    .optional(),
  id_tipoDeporte: z
    .string({ required_error: "id_tipoDeporte_requerido" })
    .nonempty("id_tipoDeporte_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "id_tipoDeporte_requerido" }))
    .optional(),
});
