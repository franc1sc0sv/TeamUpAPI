import z from "zod";

const deporteEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  descripcion: z
    .string({ required_error: "La descripion ser un string" })
    .nonempty("La descripion no debe estar vacio"),
  limiteJugadores: z.string().regex(/^\d+$/).transform(Number).or(z.number()),
  limiteJugadoresCambio: z.string().regex(/^\d+$/).transform(Number).or(z.number()),
  id_tipoDeporte: z.string().regex(/^\d+$/).transform(Number).or(z.number()),
});

const deporteEsquemaActualzar = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio")
    .optional(),
  descripcion: z
    .string({ required_error: "La descripion ser un string" })
    .nonempty("La descripion no debe estar vacio")
    .optional(),
  limiteJugadores: z.string().regex(/^\d+$/).transform(Number).or(z.number()).optional(),
  limiteJugadoresCambio: z.string().regex(/^\d+$/).transform(Number).or(z.number()).optional(),
  id_tipoDeporte: z.string().regex(/^\d+$/).transform(Number).or(z.number()).optional(),
});

export { deporteEsquema, deporteEsquemaActualzar };
