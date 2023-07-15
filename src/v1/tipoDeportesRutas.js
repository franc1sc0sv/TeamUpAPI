import { Router } from "express";   
import { tipoDeporteController } from "../controladores/tipoDeporteControlador.js";

const router = Router();

router.get("/", tipoDeporteController.obtenerTodos);

export default router 

