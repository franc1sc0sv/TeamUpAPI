import { deporteSoloNombreSelect } from "./deporte.js";
import { equipoGeneralesSelect } from "./equipo.js";

export const partidoSelect = {
  id: true,
  deporte: deporteSoloNombreSelect,
  equipo_local: equipoGeneralesSelect,
  equipo_visitante: equipoGeneralesSelect,
  estado: true,
  fecha: true,
  usuarioMaestro: true,
  ZonaDejuego: {
    select: {
      id: true,
      nombre: true,
      imagenes: true,
    },
  },
};

export const partidosPendientes = {
  ...partidoSelect,
  equipo_local: {
    select: {
      lider: {
        select: {
          nombre: true,
        },
      },
    },
  },
};

export const misPartidosWhere = (equipos_ids, id_usuario) => ({
  AND: [
    {
      OR: [
        { id_equipo_local: { in: equipos_ids } },
        { id_equipo_visitante: { in: equipos_ids } },
      ],
    },
    {
      usuarios: {
        some: { id_usuario },
      },
    },
  ],
});

export const partidosEquiposLiderSelect = {
  equipo_local: {
    select: {
      lider: true,
    },
  },
  equipo_visitante: {
    select: {
      lider: true,
    },
  },
};
