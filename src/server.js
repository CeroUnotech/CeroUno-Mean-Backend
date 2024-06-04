import express from "express";
import cors from 'cors';
import DB from "./database/db.js";
import Libro from "./database/models/Libro.js";

//* Configuración del servidor
const _PORT = process.env.PORT || 3000;

//* Creamos el servidor
const _APP = express();

//* Configuración de CORS
_APP.use(cors());
//* Configuración de JSON
_APP.use(express.json({ limit: '2048mb' }));

//* Creamos el Objeto de DB (base de datos)
const _DB = new DB();

//? Petición base a nuestro dominio
_APP.get("/", (req, res) => {
    //* Enviamos un mensaje básico que diga los Endpoints (Rutas) de nuestra API
    res.status(200).send("Rutas de API: /libro, /libros.");
});

//? Ruta para obtener todos los Libros
_APP.get("/libros", async (req, res) => {
    //* Buscamos todos los libros, excluyendo los datos "_id", "createdAt", "updatedAt" y "__v"
    const libros = await Libro.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    res.status(200).json(libros);
});

//? Ruta para obtener un Libro por ID
_APP.get("/libro", async (req, res) => {
    //* Accedemos al parámetro ID de nuestro Query (URL)
    const { id } = req.query;
    //* Buscamos el libro por su ID, excluyendo los datos "_id", "createdAt", "updatedAt" y "__v"
    const libro = await Libro.findOne({ id }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    //* Si el libro no existe, devolvemos un error
    if (!libro) {
        return res.status(404).json({ error: "No existe un Libro con esa ID" });
    }
    return res.status(200).json(libro);
});

//? Ruta para crear un Libro
_APP.post("/libro", async (req, res) => {
    //* Accedemos al body de la petición (a los datos que enviamos)
    const data = req.body;
    try {
        //* Creamos un nuevo libro
        const libro = new Libro(data);
        //* Guardamos el libro en la base de datos
        await libro.save();
        return res.status(201).json({ success: "Libro Creado", libro });
    } catch (e) {
        return res.status(400).json({ error: "No se pudo crear el Libro" });
    }
});

//? Ruta para actualizar un Libro
_APP.put("/libro", async (req, res) => {
    //* Accedemos al parámetro ID de nuestro Query (URL)
    const { id } = req.query;
    //* Accedemos al body de la petición (a los datos que enviamos)
    const data = req.body;
    //* Buscamos el libro por su ID, excluyendo los datos "_id", "createdAt", "updatedAt" y "__v"
    const libro = await Libro.findOne({ id }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
    //* Si el libro no existe, devolvemos un error
    if (!libro) {
        return res.status(404).json({ error: "No existe un Libro con esa ID" });
    }
    //* Actualizamos los datos del libro
    try {
        //* Utilizamos el método updateOne de Mongoose para actualizar el libro en la base de datos
        await Libro.updateOne({ id }, data);
        return res.status(200).json({ success: "Libro Actualizado", libro });
    } catch (e) {
        return res.status(400).json({ error: "No se pudo actualizar el Libro" });
    }
});

//? Ruta para eliminar un Libro
_APP.delete("/libro", async (req, res) => {
    //* Accedemos al parámetro ID de nuestro Query (URL)
    const { id } = req.query;
    try {
        //* Utilizamos el método findOneAndDelete de Mongoose para encontrar el libro dada su ID y eliminarlo.
        const libro = await Libro.findOneAndDelete({ id });
        if (!libro) {
            return res.status(404).json({ error: "No se encontró el Libro" });
        }
        return res.status(200).json({ success: "Se eliminó el Libro", libro });
    } catch (e) {
        return res.status(400).json({ error: "No se ha podido eliminar el Libro" });
    }
});

//* Hacemos que nuestra APP o Server se ejecute en el puerto asignado en el .env o 3000 en su defecto.
_APP.listen(_PORT, () => {
    console.log("Servidor conectado al puerto " + _PORT);
});
