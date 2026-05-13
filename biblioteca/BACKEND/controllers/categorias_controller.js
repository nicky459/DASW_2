import Categoria from "../models/categoria.js";

// GET /categorias — Listar todas las categorías
export async function getCategorias(req, res) {
    try {
        let categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST /categorias — Crear categoría (admin)
export async function crearCategoria(req, res) {
    try {
        let { nombre_categoria, descripcion } = req.body;
        if (!nombre_categoria) return res.status(400).json({ error: "El nombre es obligatorio" });

        let nueva = new Categoria({ nombre_categoria, descripcion });
        await nueva.save();

        res.status(201).json({ message: "Categoría creada", categoria: nueva });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// PUT /categorias/:id — Editar categoría (admin)
export async function actualizarCategoria(req, res) {
    try {
        let { nombre_categoria, descripcion } = req.body;
        let categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });

        if (nombre_categoria) categoria.nombre_categoria = nombre_categoria;
        if (descripcion !== undefined) categoria.descripcion = descripcion;
        await categoria.save();

        res.json({ message: "Categoría actualizada", categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// DELETE /categorias/:id — Eliminar categoría (admin)
export async function eliminarCategoria(req, res) {
    try {
        let categoria = await Categoria.findByIdAndDelete(req.params.id);
        if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
