import z from "zod";

const zonaJuegosEsquemas = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  id_tipoDeporte: z
    .string({ required_error: "id_tipoDeporte_requerido" })
    .nonempty("id_tipoDeporte_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "id_tipoDeporte_requerido" })),
});

const zonaJuegosEsquemasActualizar = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio")
    .optional(),
  id_tipoDeporte: z
    .string({ required_error: "id_tipoDeporte_requerido" })
    .nonempty("id_tipoDeporte_vacio")
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "id_tipoDeporte_requerido" }))
    .optional(),
  imagen_eliminadas: z
    .array(z.string())
    .transform((value) => value.map(Number))
    .or(z.array(z.number()))
    .optional(),
});

export { zonaJuegosEsquemas, zonaJuegosEsquemasActualizar };
