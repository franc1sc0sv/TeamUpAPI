import z from "zod";

const solicitudEsquema = z.object({
  id_deporte: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
  id_equipo_local: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
  id_equipo_visitante: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
  descripcion: z
    .string({ required_error: "descripcion_required" })
    .nonempty("descripcion_vacia"),
  fecha: z
    .string({ required_error: "fecha_requerida" })
    .nonempty("fecha_vacia"),
  jugadores: z.array(z.object({}), { required_error: "jugadores_required" }),
  maestro_intermediario: z
    .boolean({ required_error: "maestro_intermediario_required" })
    .nullish("maestro_intermediario"),
});

const solicitudJugadoresEsquema = z.object({
  id: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  rango: z.string({ required_error: "rango_required" }).nonempty("rango_vacio"),
  estado: z
    .string({ required_error: "estado_required" })
    .nonempty("estado_vacio")
    .nullable(),
});

const aceptarSolicitudVisitante = z.object({
  jugadores: z
    .array(z.object({}), { required_error: "jugadores_required" })
    .nonempty("jugadores_vacio"),
});

const aceptarSolicitudCoordinacionEsquema = z.object({
  id_zona_juego: z.string().regex(/^\d+$/).transform(Number),
});

const posponerSolicitudEsquema = z.object({
  fecha: z.date().refine((date) => date >= new Date(), {
    message: "fecha_invalida",
  }),
  hora: z.string().regex(/^(0[7-9]|1[0-6]):[0-5][0-9]$|17:00|17:30/),
});

export const posponerEsquema = z.object({
  fecha: z
    .string({ required_error: "fecha_requerida" })
    .nonempty("fecha_vacia")
    .or(z.date({ required_error: "fecha_requerida" })),
});

export const aceptarPartido = z.object({
  id_zona_juego: z
    .number({ required_error: "zona_de_juego_required" })
    .nonnegative("positive_nmber"),
});

const verificarSiEquipoJuegaMaestrosEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
});

export const partidoResultadoEsquema = z.object({
  resultado_local: z.number({ required_error: "resultado_local_required" }),
  resultado_visitante: z.number({
    required_error: "resultado_visitante_required",
  }),
});

export {
  solicitudEsquema,
  solicitudJugadoresEsquema,
  aceptarSolicitudCoordinacionEsquema,
  posponerSolicitudEsquema,
  aceptarSolicitudVisitante,
  verificarSiEquipoJuegaMaestrosEsquema,
};
