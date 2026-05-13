import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import routerApi from "./routes/api.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../FRONTEND")));
app.use("/controllers", express.static(path.join(__dirname, "../FRONTEND/controllers")));
app.use("/views", express.static(path.join(__dirname, "../FRONTEND/views")));
app.use("/assets", express.static(path.join(__dirname, "../FRONTEND/assets")));

// Rutas de la API
app.use(routerApi);

app.listen(port, () => {
    console.log(`Biblioteca corriendo en http://localhost:${port}`);
});
