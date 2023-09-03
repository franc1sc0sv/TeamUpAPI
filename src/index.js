import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

//Routers
import { usuarioRouter } from "./v1/usuarioRutas.js";
import { deporteRouter } from "./v1/deporteRutas.js";
import { zonaJuegoRouter } from "./v1/zonaJuegoRouter.js";
import { equipoRouter } from "./v1/equipoRutas.js";
import { partidoRouter } from "./v1/partidoRutas.js";

import nivelAcademicoRouter from "./v1/nivelAcademicoRutas.js";
import tipoDeporteRouter from "./v1/tipoDeportesRutas.js";

import {
  __ESTADOS_PARTIDOS__,
  __NIVELES_ACADEMICOS__,
  __TIPOS_DEPORTES__,
} from "./constantes/datosEstaticosDB.js";

import { generarId } from "./helper/generarId.js";
import { goodResponse } from "./helper/index.js";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";

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
app.use(BASE_URL + "/partidos", partidoRouter);

//Default route
app.get("/", async(req, res) => {
  try {
    const dbWorking = await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json(goodResponse({
      server: 1,
      db: 1
    }))

  } catch (error) {
    if(error instanceof PrismaClientInitializationError){
      return res.status(200).json(goodResponse({
        server: 1,
        db: 0
      }))
    }
  }
});

//Initialize server
app.listen(PORT, () => {
  console.log("Lisening at: " + PORT);
});

console.log(process.env.EMAIL_DOMAIN_RESTRICT);

//Insertar data para por defecto
const prisma = new PrismaClient();
const arrayEstadosPartidos = Object.values(__ESTADOS_PARTIDOS__);
const arrayNivelesAcacemicos = Object.values(__NIVELES_ACADEMICOS__);
//Crear datos por defecto
(async function () {
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
      console.log("Niveles academicos creados !");
      await prisma.nivelAcademico.createMany({
        data: arrayNivelesAcacemicos,
      });
    }

    const tiposDeportes = await prisma.tipoDeporte.findFirst();

    if (!tiposDeportes) {
      console.log("Tipos deportes creados !");
      await prisma.tipoDeporte.createMany({
        data: Object.entries(__TIPOS_DEPORTES__).map((deporte) => deporte[1]),
      });
    }

    const coordinador = await prisma.usuarios.findFirst({
      where: { role: "COORDINADOR" },
    });

    if (!coordinador) {
      console.log("Coordinador creado !");
      const salt = await bcrypt.genSalt(5);
      const password = await bcrypt.hash("123123123", salt);

      await prisma.usuarios.create({
        data: {
          email: "coordinacion@cdb.edu.sv",
          password,
          id_nivelAcademico: 1,
          nombre: "Juan",
          role: "COORDINADOR",
          token: generarId(),
        },
      });
    }
  } catch (error) {
    
  }
})();
