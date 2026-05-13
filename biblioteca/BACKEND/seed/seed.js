import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Categoria from "../models/categoria.js";
import Libro from "../models/libro.js";
import Usuario from "../models/usuario.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/biblioteca");
    console.log("Conectado a MongoDB para seed...");

    // Limpiar colecciones
    await Categoria.deleteMany({});
    await Libro.deleteMany({});
    await Usuario.deleteMany({});

    // Categorías
    let categorias = await Categoria.insertMany([
        { nombre_categoria: "Novela",     descripcion: "Obras de ficción narrativa" },
        { nombre_categoria: "Ciencia",    descripcion: "Libros de divulgación científica" },
        { nombre_categoria: "Historia",   descripcion: "Libros históricos y biográficos" },
        { nombre_categoria: "Fantasía",   descripcion: "Obras de fantasía y mundo mágico" },
        { nombre_categoria: "Tecnología", descripcion: "Programación, software y tecnología" },
    ]);
    console.log("Categorías insertadas:", categorias.map(c => c.nombre_categoria));

    let [novela, ciencia, historia, fantasia, tecnologia] = categorias;

    // Libros
    let libros = await Libro.insertMany([
        { titulo: "Cien años de soledad",      autor: "Gabriel García Márquez", isbn: "978-0-06-112008-4", categoria_id: novela._id,     cantidad_disponible: 3, anio_publicacion: 1967 },
        { titulo: "El principito",             autor: "Antoine de Saint-Exupéry", isbn: "978-84-261-3428-7", categoria_id: novela._id,   cantidad_disponible: 5, anio_publicacion: 1943 },
        { titulo: "Sapiens",                   autor: "Yuval Noah Harari",       isbn: "978-84-9992-395-7", categoria_id: historia._id,  cantidad_disponible: 2, anio_publicacion: 2011 },
        { titulo: "Una breve historia del tiempo", autor: "Stephen Hawking",    isbn: "978-84-08-04461-0", categoria_id: ciencia._id,   cantidad_disponible: 4, anio_publicacion: 1988 },
        { titulo: "El Señor de los Anillos",   autor: "J.R.R. Tolkien",         isbn: "978-84-450-7179-3", categoria_id: fantasia._id,  cantidad_disponible: 3, anio_publicacion: 1954 },
        { titulo: "Clean Code",                autor: "Robert C. Martin",        isbn: "978-0-13-235088-4", categoria_id: tecnologia._id, cantidad_disponible: 2, anio_publicacion: 2008 },
        { titulo: "Harry Potter y la piedra filosofal", autor: "J.K. Rowling",  isbn: "978-84-9838-813-3", categoria_id: fantasia._id,  cantidad_disponible: 4, anio_publicacion: 1997 },
        { titulo: "El origen de las especies", autor: "Charles Darwin",          isbn: "978-84-460-1484-6", categoria_id: ciencia._id,   cantidad_disponible: 2, anio_publicacion: 1859 },
        { titulo: "Don Quijote de la Mancha",  autor: "Miguel de Cervantes",     isbn: "978-84-376-0494-7", categoria_id: novela._id,    cantidad_disponible: 3, anio_publicacion: 1605 },
        { titulo: "Homo Deus",                 autor: "Yuval Noah Harari",       isbn: "978-84-9992-700-9", categoria_id: historia._id,  cantidad_disponible: 2, anio_publicacion: 2015 },
    ]);
    console.log("Libros insertados:", libros.length);

    // Usuario admin
    let admin = new Usuario({ nombre: "Administrador", correo: "admin@biblioteca.com", contrasena: "admin1234", tipo_usuario: "admin" });
    await admin.save();

    // Usuario de prueba
    let usuario = new Usuario({ nombre: "Ana García", correo: "ana@ejemplo.com", contrasena: "usuario1234", tipo_usuario: "usuario" });
    await usuario.save();

    console.log("Usuarios creados:");
    console.log("  Admin   -> admin@biblioteca.com / admin1234");
    console.log("  Usuario -> ana@ejemplo.com / usuario1234");

    await mongoose.disconnect();
    console.log("Seed completado.");
}

seed().catch(err => { console.error(err); process.exit(1); });
