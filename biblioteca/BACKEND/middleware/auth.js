import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware: verifica que el token JWT sea válido
export function verificarToken(req, res, next) {
    let authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    let token = authHeader.split(" ")[1];

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

// Middleware: verifica que el usuario sea administrador
export function soloAdmin(req, res, next) {
    if (req.usuario.tipo_usuario !== "admin") {
        return res.status(403).json({ error: "Acceso restringido a administradores" });
    }
    next();
}
