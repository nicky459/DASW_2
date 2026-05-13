import Usuario from "../models/usuario.js";

// GET /usuarios — Listar todos los usuarios (admin)
export async function getUsuarios(req, res) {
    try {
        let usuarios = await Usuario.find().select("-contrasena");
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /usuarios — Crear usuario manualmente (admin)
export async function crearUsuario(req, res) {
    try {
        let { nombre, correo, contrasena, tipo_usuario } = req.body;

        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
        }

        let existe = await Usuario.findOne({ correo });
        if (existe) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        let nuevoUsuario = new Usuario({ nombre, correo, contrasena, tipo_usuario: tipo_usuario || "usuario" });
        await nuevoUsuario.save();

        res.status(201).json({
            message: "Usuario creado correctamente",
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

// GET /usuarios/:id — Ver detalle de un usuario (admin)
export async function getUsuario(req, res) {
    try {
        let usuario = await Usuario.findById(req.params.id).select("-contrasena");
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /usuarios/:id — Editar usuario (admin)
export async function actualizarUsuario(req, res) {
    try {
        let { nombre, correo, tipo_usuario } = req.body;
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        if (nombre) usuario.nombre = nombre;
        if (correo) usuario.correo = correo;
        if (tipo_usuario) usuario.tipo_usuario = tipo_usuario;

        await usuario.save();

        res.json({
            message: "Usuario actualizado",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// DELETE /usuarios/:id — Eliminar usuario (admin)
export async function eliminarUsuario(req, res) {
    try {
        let usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
