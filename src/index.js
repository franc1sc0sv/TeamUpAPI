import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

//Routers
import { usuarioRouter } from "./v1/usuarioRutas.js";
import { deporteRouter } from "./v1/deporteRutas.js";
import { zonaJuegoRouter } from "./v1/zonaJuegoRouter.js";
import { equipoRouter } from "./v1/equipoRutas.js";
import nivelAcademicoRouter from "./v1/nivelAcademicoRutas.js";
import tipoDeporteRouter from "./v1/tipoDeportesRutas.js";

import {
  __ESTADOS_PARTIDOS__,
  __NIVELES_ACADEMICOS__,
} from "./constantes/datosEstaticosDB.js";

dotenv.config();

//Constants
const BASE_URL = "/api/v1";
const PORT = process.env.PORT || 8080;
const app = express();

//Config
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("./uploads"));

//Router
app.use(BASE_URL + "/usuario", usuarioRouter);
app.use(BASE_URL + "/deporte", deporteRouter);
app.use(BASE_URL + "/zonaJuego", zonaJuegoRouter);
app.use(BASE_URL + "/equipo", equipoRouter);
app.use(BASE_URL + "/niveles-academicos", nivelAcademicoRouter);
app.use(BASE_URL + "/tipos-deportes", tipoDeporteRouter);

//Default route
app.get("/", (req, res) => {
  res.send("Welcome to TeamUp API - Lisening at: " + PORT);
});

//Initialize server
app.listen(PORT, () => {
  console.log("Lisening at: " + PORT);
});

//Insertar data para por defecto

const prisma = new PrismaClient();

const arrayEstadosPartidos = Object.values(__ESTADOS_PARTIDOS__);
const arrayNivelesAcacemicos = Object.values(__NIVELES_ACADEMICOS__);

//Crear datos por defecto
!(async function () {
  try {
    const isPartidoEstados = await prisma.partidosEstado.findFirst();

    if (!isPartidoEstados) {
      console.log("Estados de los partidos creados !");
      await prisma.partidosEstado.createMany({
        data: arrayEstadosPartidos,
      });
    }

    const isNivelesAcademicos = await prisma.nivelAcademico.findFirst();

    if (!isNivelesAcademicos) {
      console.log("Nivelea academicos creados !");
      await prisma.nivelAcademico.createMany({
        data: arrayNivelesAcacemicos,
      });
    }
  } catch (error) {
    throw { status: "FAILED", data: { error: error?.message || error } };
  }
})();
