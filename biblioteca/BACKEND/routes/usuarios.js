import express from "express";
import * as usuariosController from "../controllers/usuarios_controller.js";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

let routerUsuarios = express.Router();

routerUsuarios.use(verificarToken, soloAdmin);

routerUsuarios.get("/", usuariosController.getUsuarios);
routerUsuarios.post("/", usuariosController.crearUsuario);
routerUsuarios.get("/:id", usuariosController.getUsuario);
routerUsuarios.put("/:id", usuariosController.actualizarUsuario);
routerUsuarios.delete("/:id", usuariosController.eliminarUsuario);

export default routerUsuarios;
