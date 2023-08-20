export const __ESTADOS_PARTIDOS__ = {
  PendienteRival: {
    id: 1,
    nombre: "Pendiente rival",
    descripcion: "",
    fase: 1,
  },
  PendienteMaestro: {
    id: 2,
    nombre: "Pendiente maestro",
    descripcion: "",
    fase: 2
  },
  PendienteCoordinacion: {
    id: 3,
    nombre: "Pendiente coordinacion",
    descripcion: "",
    fase: 3
  },
  PendienteAsistencia: {
    id: 4,
    nombre: "Pendiente asistencia",
    descripcion: "",
    fase: 4
  },
  EnJuego: {
    id: 5,
    nombre: "Partido en juego",
    descripcion: "",
    fase: 5
  },
  Finalizado: {
    id: 6,
    nombre: "Partido finalizado",
    descripcion: "",
    fase: 6
  },
  Cancelado: {
    id: 7,
    nombre: "Partido cancelado",
    descripcion: "",
    fase: 7
  },
};

export const __NIVELES_ACADEMICOS__ = {
  Parvularia: {
    id: 1,
    nivel: "Parvularia",
  },
  PrimerCiclo: {
    id: 2,
    nivel: "Primer ciclo",
  },
  SegundoCiclo: {
    id: 3,
    nivel: "Segundo ciclo",
  },
  TercerCiclo: {
    id: 4,
    nivel: "Tercer ciclo",
  },
  Bachillerato: {
    id: 5,
    nivel: "Bachillerato",
  },
};

export const __TIPOS_DEPORTES__ = {
  CanchaRegulada: {
    id: 1,
    nombre: "Cancha Regulada",
    descripcion:
      "Para solicitar un partido de este tipo de deportes deben pasar por coordinacion y un maestro debera cuidarlos",
  },

  SinCancha: {
    id: 2,
    nombre: "Sin Cancha",
    descripcion:
      "Es opcional las personas que supervisen los partidos de estos deportes y las solicitudes no pasan por coordinacion ni por los maestros, pero los usuarios pueden tener un maestro si lo desean",
    skipCoordinacion: true,
    opcionalMaestro: true
    },
};
