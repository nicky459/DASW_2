import Libro from "../models/libro.js";
import Prestamo from "../models/prestamo.js";

// GET /libros — Listar libros con filtros opcionales
export async function getLibros(req, res) {
    try {
        let filtro = {};
        if (req.query.categoria) filtro.categoria_id = req.query.categoria;
        if (req.query.busqueda) {
            let regex = new RegExp(req.query.busqueda, "i");
            filtro.$or = [{ titulo: regex }, { autor: regex }];
        }

        let libros = await Libro.find(filtro).populate("categoria_id", "nombre_categoria");
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET /libros/recomendados — Libros recomendados para el usuario autenticado
export async function getRecomendados(req, res) {
    try {
        let idUsuario = req.usuario.id;

        let prestamos = await Prestamo.find({ id_usuario: idUsuario }).populate({
            path: "id_libro",
            populate: { path: "categoria_id", select: "nombre_categoria" }
        });

        if (prestamos.length === 0) {
            return res.json({ secciones: [] });
        }

        let librosPrestadosIds = prestamos.map(p => p.id_libro?._id?.toString()).filter(Boolean);

        let conteoCategoria = {};
        let nombreCategoria = {};
        for (let p of prestamos) {
            if (p.id_libro?.categoria_id) {
                let catId = p.id_libro.categoria_id._id.toString();
                let catNombre = p.id_libro.categoria_id.nombre_categoria;
                conteoCategoria[catId] = (conteoCategoria[catId] || 0) + 1;
                nombreCategoria[catId] = catNombre;
            }
        }

        let categoriasFav = Object.keys(conteoCategoria)
            .sort((a, b) => conteoCategoria[b] - conteoCategoria[a])
            .slice(0, 3);

        let secciones = [];
        for (let catId of categoriasFav) {
            let libros = await Libro.find({
                categoria_id: catId,
                cantidad_disponible: { $gt: 0 },
                _id: { $nin: librosPrestadosIds }
            }).populate("categoria_id", "nombre_categoria").limit(4);

            if (libros.length > 0) {
                secciones.push({ categoria: nombreCategoria[catId], libros });
            }
        }

        res.json({ secciones });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// GET /libros/:id — Detalle de un libro
export async function getLibro(req, res) {
    try {
        let libro = await Libro.findById(req.params.id).populate("categoria_id", "nombre_categoria");
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /libros — Crear libro (admin)
export async function crearLibro(req, res) {
    try {
        let { titulo, autor, isbn, categoria_id, cantidad_disponible, anio_publicacion, imagen_portada } = req.body;

        if (!titulo || !autor || !isbn || !categoria_id) {
            return res.status(400).json({ error: "Título, autor, ISBN y categoría son obligatorios" });
        }

        let nuevo = new Libro({ titulo, autor, isbn, categoria_id, cantidad_disponible, anio_publicacion, imagen_portada });
        await nuevo.save();
        await nuevo.populate("categoria_id", "nombre_categoria");

        res.status(201).json({ message: "Libro creado correctamente", libro: nuevo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// PUT /libros/:id — Editar libro (admin)
export async function actualizarLibro(req, res) {
    try {
        let libro = await Libro.findById(req.params.id);
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

        let campos = ["titulo", "autor", "isbn", "categoria_id", "cantidad_disponible", "anio_publicacion", "imagen_portada"];
        for (let campo of campos) {
            if (req.body[campo] !== undefined) libro[campo] = req.body[campo];
        }

        await libro.save();
        res.json({ message: "Libro actualizado", libro });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// DELETE /libros/:id — Eliminar libro (admin, solo si no tiene préstamos activos)
export async function eliminarLibro(req, res) {
    try {
        let prestamoActivo = await Prestamo.findOne({ id_libro: req.params.id, estado: "activo" });
        if (prestamoActivo) {
            return res.status(400).json({ error: "No se puede eliminar un libro con préstamos activos" });
        }

        let libro = await Libro.findByIdAndDelete(req.params.id);
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });

        res.json({ message: "Libro eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
