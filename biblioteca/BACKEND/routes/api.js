import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./auth.js";
import usuariosRouter from "./usuarios.js";
import librosRouter from "./libros.js";
import categoriasRouter from "./categorias.js";
import prestamosRouter from "./prestamos.js";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

let routerApi = express.Router();

// Vistas HTML
routerApi.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/login.html")));
routerApi.get("/catalogo.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/catalogo.html")));
routerApi.get("/detalle.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/detalle.html")));
routerApi.get("/mis-prestamos.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/mis-prestamos.html")));
routerApi.get("/admin/dashboard.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/admin/dashboard.html")));
routerApi.get("/admin/libros.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/admin/libros.html")));
routerApi.get("/admin/usuarios.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/admin/usuarios.html")));
routerApi.get("/admin/categorias.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/admin/categorias.html")));
routerApi.get("/admin/prestamos.html", (req, res) => res.sendFile(path.resolve(__dirname, "../../FRONTEND/views/admin/prestamos.html")));

// Rutas de la API
routerApi.use("/auth", authRouter);
routerApi.use("/usuarios", usuariosRouter);
routerApi.use("/libros", librosRouter);
routerApi.use("/categorias", categoriasRouter);
routerApi.use("/prestamos", prestamosRouter);

export default routerApi;
