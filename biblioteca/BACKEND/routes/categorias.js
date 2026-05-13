import express from "express";
import * as categoriasController from "../controllers/categorias_controller.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

let routerCategorias = express.Router();

// GET es público (lo necesita el catálogo y el formulario de libros)
routerCategorias.get("/", categoriasController.getCategorias);

// Las demás solo admin
routerCategorias.post("/", verificarToken, soloAdmin, categoriasController.crearCategoria);
routerCategorias.put("/:id", verificarToken, soloAdmin, categoriasController.actualizarCategoria);
routerCategorias.delete("/:id", verificarToken, soloAdmin, categoriasController.eliminarCategoria);

export default routerCategorias;
