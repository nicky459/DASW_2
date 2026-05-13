import Usuario from "../models/usuario.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// POST /auth/register — Registrar usuario nuevo
export async function register(req, res) {
    try {
        let { nombre, correo, contrasena, confirmar_contrasena } = req.body;

        if (!nombre || !correo || !contrasena || !confirmar_contrasena) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (contrasena !== confirmar_contrasena) {
            return res.status(400).json({ error: "Las contraseñas no coinciden" });
        }

        let existe = await Usuario.findOne({ correo });
        if (existe) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        let nuevoUsuario = new Usuario({ nombre, correo, contrasena, tipo_usuario: "usuario" });
        await nuevoUsuario.save();

        let token = jwt.sign(
            { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo, tipo_usuario: nuevoUsuario.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                tipo_usuario: nuevoUsuario.tipo_usuario
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// POST /auth/login — Iniciar sesión
export async function login(req, res) {
    try {
        let { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
        }

        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        let passwordOk = await usuario.compararContrasena(contrasena);
        if (!passwordOk) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        let token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, tipo_usuario: usuario.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /auth/logout — Cerrar sesión (el cliente elimina el token)
export function logout(req, res) {
    res.json({ message: "Sesión cerrada correctamente" });
}
