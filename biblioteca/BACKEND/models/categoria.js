import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre_categoria: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ""
    }
});

const Categoria = mongoose.model("Categoria", categoriaSchema);
export default Categoria;
