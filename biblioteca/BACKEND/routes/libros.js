import express from "express";
import * as librosController from "../controllers/libros_controller.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

let routerLibros = express.Router();

// GET /libros/recomendados — requiere token de usuario
routerLibros.get("/recomendados", verificarToken, librosController.getRecomendados);

// GET /libros y GET /libros/:id — públicos
routerLibros.get("/", librosController.getLibros);
routerLibros.get("/:id", librosController.getLibro);

// Operaciones admin
routerLibros.post("/", verificarToken, soloAdmin, librosController.crearLibro);
routerLibros.put("/:id", verificarToken, soloAdmin, librosController.actualizarLibro);
routerLibros.delete("/:id", verificarToken, soloAdmin, librosController.eliminarLibro);

export default routerLibros;
