import mongoose from "mongoose";

const prestamoSchema = new mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "El usuario es obligatorio"]
    },
    id_libro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Libro",
        required: [true, "El libro es obligatorio"]
    },
    fecha_prestamo: {
        type: Date,
        default: Date.now
    },
    fecha_devolucion: {
        type: Date
    },
    estado: {
        type: String,
        enum: ["activo", "devuelto"],
        default: "activo"
    }
});

const Prestamo = mongoose.model("Prestamo", prestamoSchema);
export default Prestamo;
