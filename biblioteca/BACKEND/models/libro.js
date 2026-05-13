import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true
    },
    autor: {
        type: String,
        required: [true, "El autor es obligatorio"],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, "El ISBN es obligatorio"],
        unique: true,
        trim: true
    },
    categoria_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "La categoría es obligatoria"]
    },
    cantidad_disponible: {
        type: Number,
        required: [true, "La cantidad disponible es obligatoria"],
        min: [0, "La cantidad no puede ser negativa"],
        default: 1
    },
    anio_publicacion: {
        type: Number
    },
    imagen_portada: {
        type: String,
        default: ""
    }
});

const Libro = mongoose.model("Libro", libroSchema);
export default Libro;
