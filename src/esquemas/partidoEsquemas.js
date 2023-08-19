import z from "zod";

const isWithinInterval = (date, startHour, endHour) => {
  const hours = date.getHours();
  return hours >= startHour && hours <= endHour;
};

const solicitudEsquema = z.object({
  id_deporte: z.number(),
  id_equipo_local: z.number(),
  id_equipo_visitante: z.number(),
  descripcion: z
    .string({ required_error: "La descripcion debe ser un string" })
    .nonempty("La descripcion no debe estar vacia"),
  fecha: z.string(),
  jugadores: z.array(z.object({})),
  maestro_intermediario: z.boolean().nullish(),
});

const solicitudRivalJugadoresEsquema = z.object({
  id: z.number(),
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  rango: z
    .string({ required_error: "El rango debe ser un string" })
    .nonempty("El rango no debe estar vacio"),
  estado: z
    .string({ required_error: "El estado debe ser un string" })
    .nonempty("El estado no debe estar vacio")
    .nullable(),
  id_equipo: z.number(),
});

const solicitudJugadoresEsquema = z.object({
  id: z.number(),
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  rango: z
    .string({ required_error: "El rango debe ser un string" })
    .nonempty("El rango no debe estar vacio"),
  estado: z
    .string({ required_error: "El estado debe ser un string" })
    .nonempty("El estado no debe estar vacio")
    .nullable(),
});

const aceptarSolicitudVisitante = z.object({
  jugadores: z.array(z.object({})).nonempty(),
});

const aceptarSolicitudCoordinacionEsquema = z.object({
  id_zona_juego: z.string().regex(/^\d+$/).transform(Number),
});

const posponerSolicitudEsquema = z.object({
  fecha: z.date().refine((date) => date >= new Date(), {
    message: "Fecha no valida",
  }),
  hora: z.string().regex(/^(0[7-9]|1[0-6]):[0-5][0-9]$|17:00|17:30/),
});

const resultadosPartidoEsquema = z.object({});

export const posponerEsquema = z.object({
  fecha: z.string().nonempty().or(z.date()),
});

export const aceptarPartido = z.object({
  id_zona_juego: z
    .number({ required_error: "'id_zona_juego' falta" })
    .nonnegative("No debe ser negativo"),
});

const verificarSiEquipoJuegaMaestrosEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
});

export const partidoResultadoEsquema = z.object({
  resultado_local: z.number({ required_error: "resultado_local" }),
  resultado_visitante: z.number({ required_error: "resultado_visitante" }),
});

export {
  solicitudEsquema,
  solicitudJugadoresEsquema,
  aceptarSolicitudCoordinacionEsquema,
  posponerSolicitudEsquema,
  aceptarSolicitudVisitante,
  verificarSiEquipoJuegaMaestrosEsquema,
};
