import Prestamo from "../models/prestamo.js";
import Libro from "../models/libro.js";

// POST /prestamos — Solicitar préstamo (usuario)
export async function solicitarPrestamo(req, res) {
    try {
        let { id_libro } = req.body;
        let idUsuario = req.usuario.id;

        if (!id_libro) return res.status(400).json({ error: "El ID del libro es obligatorio" });

        let libro = await Libro.findById(id_libro);
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
        if (libro.cantidad_disponible <= 0) {
            return res.status(400).json({ error: "El libro no está disponible" });
        }

        // Verificar que el usuario no tenga ya ese libro prestado y activo
        let prestamoExistente = await Prestamo.findOne({ id_usuario: idUsuario, id_libro, estado: "activo" });
        if (prestamoExistente) {
            return res.status(400).json({ error: "Ya tienes este libro en préstamo activo" });
        }

        // Calcular fecha de devolución (14 días)
        let fechaDevolucion = new Date();
        fechaDevolucion.setDate(fechaDevolucion.getDate() + 14);

        let nuevoPrestamo = new Prestamo({
            id_usuario: idUsuario,
            id_libro,
            fecha_devolucion: fechaDevolucion,
            estado: "activo"
        });
        await nuevoPrestamo.save();

        // Reducir disponibilidad del libro
        libro.cantidad_disponible -= 1;
        await libro.save();

        await nuevoPrestamo.populate("id_libro", "titulo autor imagen_portada");

        res.status(201).json({ message: "Préstamo registrado correctamente", prestamo: nuevoPrestamo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET /prestamos/usuario — Préstamos del usuario autenticado
export async function getMisPrestamos(req, res) {
    try {
        let idUsuario = req.usuario.id;
        let { estado } = req.query;

        let filtro = { id_usuario: idUsuario };
        if (estado) filtro.estado = estado;

        let prestamos = await Prestamo.find(filtro)
            .populate("id_libro", "titulo autor imagen_portada")
            .sort({ fecha_prestamo: -1 });

        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /prestamos/:id/devolver — Marcar como devuelto (usuario)
export async function devolverLibro(req, res) {
    try {
        let prestamo = await Prestamo.findById(req.params.id);
        if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" });
        if (prestamo.id_usuario.toString() !== req.usuario.id) {
            return res.status(403).json({ error: "No tienes permiso para devolver este préstamo" });
        }
        if (prestamo.estado === "devuelto") {
            return res.status(400).json({ error: "Este préstamo ya fue devuelto" });
        }

        prestamo.estado = "devuelto";
        prestamo.fecha_devolucion = new Date();
        await prestamo.save();

        // Aumentar disponibilidad del libro
        await Libro.findByIdAndUpdate(prestamo.id_libro, { $inc: { cantidad_disponible: 1 } });

        res.json({ message: "Libro devuelto correctamente", prestamo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET /prestamos — Todos los préstamos (admin)
export async function getTodosPrestamos(req, res) {
    try {
        let filtro = {};
        if (req.query.estado) filtro.estado = req.query.estado;

        let prestamos = await Prestamo.find(filtro)
            .populate("id_usuario", "nombre correo")
            .populate("id_libro", "titulo autor imagen_portada")
            .sort({ fecha_prestamo: -1 });

        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET /prestamos/:id — Detalle de un préstamo (admin)
export async function getPrestamo(req, res) {
    try {
        let prestamo = await Prestamo.findById(req.params.id)
            .populate("id_usuario", "nombre correo")
            .populate("id_libro", "titulo autor imagen_portada categoria_id");
        if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" });
        res.json(prestamo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /prestamos/:id — Actualizar estado del préstamo (admin)
export async function actualizarPrestamo(req, res) {
    try {
        let { estado } = req.body;
        let prestamo = await Prestamo.findById(req.params.id);
        if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" });

        let estadoAnterior = prestamo.estado;
        prestamo.estado = estado;
        if (estado === "devuelto" && estadoAnterior === "activo") {
            prestamo.fecha_devolucion = new Date();
            await Libro.findByIdAndUpdate(prestamo.id_libro, { $inc: { cantidad_disponible: 1 } });
        }
        await prestamo.save();

        res.json({ message: "Préstamo actualizado", prestamo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
