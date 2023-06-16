import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { usuarioRouter } from "./v1/usuarioRutas.js";

dotenv.config();

//Configuracion del servidor
const PORT = process.env.PORT || 8080;
const app = express();

//Permite recibir en el body datos en JSON
app.use(express.json());
//Permite manejar peticiones HTTP de otros lados
app.use(cors());

//Router
app.use("/api/v1/usuario", usuarioRouter);

//Ruta por defecto "/"
app.get("/", (req, res) => {
  res.send("Welcome to TeamUp API - Lisening at: " + PORT);
});

app.listen(PORT, () => {
  console.log("Lisening at: " + PORT);
});
