import { Router } from "express";   
import { nivelAcademicoControlador } from "../controladores/nivelAcademicoControlador.js";

const router = Router();

router.get("/", nivelAcademicoControlador.obtenerTodos);

export default router 

