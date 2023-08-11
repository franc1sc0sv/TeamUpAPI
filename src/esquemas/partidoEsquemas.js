import z from "zod";

const solicitudEsquema = z.object({
  id_deporte: z.number(),
  id_equipo_local: z.number(),
  jugadores: z.array(),
  id_equipo_visitante: z.number(),
  descripcion: z
    .string({ required_error: "La descripcion debe ser un string" })
    .nonempty("La descripcion no debe estar vacia"),
  hora: z.date().refine((date) => date >= new Date(), {
    message: "Fecha no valida",
  }),
  fecha: z.date().refine((date) => date >= new Date(), {
    message: "Fecha no valida",
  }),
})

  // fecha               DateTime
  // id_estado           Int

const solicitudJugadoresEsquema = z.object({

  id: z.number(),
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio").optional(),
  rango: z
    .string({ required_error: "El rango debe ser un string" })
    .nonempty("El rango no debe estar vacio").optional(),
  estado: z
    .string({ required_error: "El estado debe ser un string" })
    .nonempty("El estado no debe estar vacio"),


})

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
