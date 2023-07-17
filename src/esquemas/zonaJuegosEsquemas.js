import z from "zod";

const zonaJuegosEsquemas = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  id_deporte: z.string().regex(/^\d+$/).transform(Number),
});

const zonaJuegosEsquemasActualizar = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio")
    .optional(),
  id_deporte: z.string().regex(/^\d+$/).transform(Number).optional(),

  imagen_eliminadas: z.array(z.string()).transform((value) => value.map(Number)).or(z.array(z.number())).optional()
});

export { zonaJuegosEsquemas, zonaJuegosEsquemasActualizar };
