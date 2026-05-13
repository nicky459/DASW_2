import express from "express";
import * as prestamosController from "../controllers/prestamos_controller.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

let routerPrestamos = express.Router();

// Usuario autenticado
routerPrestamos.post("/", verificarToken, prestamosController.solicitarPrestamo);
routerPrestamos.get("/usuario", verificarToken, prestamosController.getMisPrestamos);
routerPrestamos.put("/:id/devolver", verificarToken, prestamosController.devolverLibro);

// Admin
routerPrestamos.get("/", verificarToken, soloAdmin, prestamosController.getTodosPrestamos);
routerPrestamos.get("/:id", verificarToken, soloAdmin, prestamosController.getPrestamo);
routerPrestamos.put("/:id", verificarToken, soloAdmin, prestamosController.actualizarPrestamo);

export default routerPrestamos;
