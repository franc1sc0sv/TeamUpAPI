import z from "zod";

const solicitudEsquema = z.object({
  descripcion: z
    .string({ required_error: "La descripcion debe ser un string" })
    .nonempty("La descripcion no debe estar vacia"),
  fecha: z.date().refine((date) => date >= new Date(), {
    message: "Fecha no valida",
  }),
  hora: z.string().regex(/^(0[7-9]|1[0-6]):[0-5][0-9]$|17:00|17:30/),
  id_deporte: z.string().regex(/^\d+$/).transform(Number),
  id_equipo_local: z.string().regex(/^\d+$/).transform(Number),
  id_equipo_visitante: z.string().regex(/^\d+$/).transform(Number),
  jugadores: z.array(z.object({})).nonempty(),
});

const aceptarSolicitudVisitante = z.object({
  jugadores: z.array(z.object({})).nonempty(),
});

const solicitudJugadoresEsquema = z.object({
  esReserva: z.boolean(),
  id_usuario: z.string().regex(/^\d+$/).transform(Number),
  id_partido: z.string().regex(/^\d+$/).transform(Number),
  id_equipo: z.string().regex(/^\d+$/).transform(Number),
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
  fecha: z.string().nonempty().or(z.date())
})

export const aceptarPartido = z.object({
  id_zona_juego: z.number({required_error: "'id_zona_juego' falta"}).nonnegative("No debe ser negativo")
})

const verificarSiEquipoJuegaMaestrosEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
});

export {
  solicitudEsquema,
  solicitudJugadoresEsquema,
  aceptarSolicitudCoordinacionEsquema,
  posponerSolicitudEsquema,
  aceptarSolicitudVisitante,
  verificarSiEquipoJuegaMaestrosEsquema,
};
