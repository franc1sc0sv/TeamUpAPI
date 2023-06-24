import z from "zod";

const deporteEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  descripcion: z
    .string({ required_error: "La descripion ser un string" })
    .nonempty("La descripion no debe estar vacio"),
  limiteJugadores: z.string().regex(/^\d+$/).transform(Number),
  limiteJugadoresCambio: z.string().regex(/^\d+$/).transform(Number),
  id_tipoDeporte: z.string().regex(/^\d+$/).transform(Number),
});

const deporteEsquemaActualzar = {};

export { deporteEsquema, deporteEsquemaActualzar };
