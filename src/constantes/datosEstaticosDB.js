export const __ESTADOS_PARTIDOS__ = {
  PendienteRival: {
    id: 1,
    nombre: "Pendiente rival",
    descripcion: "",
  },
  PendienteMaestro: {
    id: 2,
    nombre: "Pendiente maestro",
    descripcion: "",
  },
  PendienteCoordinacion: {
    id: 3,
    nombre: "Pendiente coordinacion",
    descripcion: "",
  },
  PendienteAsistencia: {
    id: 4,
    nombre: "Pendiente asistencia",
    descripcion: "",
  },
  EnJuego: {
    id: 5,
    nombre: "Partido en juego",
    descripcion: "",
  },
  Finalizado: {
    id: 6,
    nombre: "Partido finalizado",
    descripcion: "",
  },
  Cancelado: {
    id: 7,
    nombre: "Partido cancelado",
    descripcion: "",
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

export const __TIPOS_DEPORTES__ = [
  {
      "nombre": "Cancha Regulada",
      "descripcion": "Para solicitar un partido de este tipo de deportes deben pasar por coordinacion y un maestro debera cuidarlos"
  },
  {
  
      "nombre": "No Regulado",
      "descripcion": "No hay personas que supervisen los partidos de estos deportes y las solicitudes no pasan por coordinacion ni por los maestros"
  }
]
