import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//Routers
import { usuarioRouter } from "./v1/usuarioRutas.js";
import { deporteRouter } from "./v1/deporteRutas.js";
import { zonaJuegoRouter } from "./v1/zonaJuegoRouter.js";
import { equipoRouter } from "./v1/equipoRutas.js";
import nivelAcademicoRouter from "./v1/nivelAcademicoRutas.js";

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
app.use(BASE_URL + "/niveles-academicos", nivelAcademicoRouter) 

//Default route
app.get("/", (req, res) => {
  res.send("Welcome to TeamUp API - Lisening at: " + PORT);
});

//Initialize server
app.listen(PORT, () => {
  console.log("Lisening at: " + PORT);
});
