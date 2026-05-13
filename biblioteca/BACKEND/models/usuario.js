import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo no es válido"]
    },
    contrasena: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    tipo_usuario: {
        type: String,
        enum: ["admin", "usuario"],
        default: "usuario"
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
});

// Hash de la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
    if (!this.isModified("contrasena")) return next();
    this.contrasena = await bcrypt.hash(this.contrasena, 10);
    next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContrasena = async function (contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
