import mongoose, { Schema } from "mongoose";
import { v4 as UUIDv4 } from 'uuid';

//* Creamos el Schema (Plantilla) de nuestro Modelo.
const LibroSchema = new Schema({
    //* Asignamos la ID como tipo String y valor único.
    id: { type: String, unique: true },
    autor: { type: String },
    titulo: { type: String },
    descripcion: { type: String },
    stock: { type: Number },
    precio: { type: Number },
    imagen: { type: String }
}, { timestamps: true });
//* Activamos las timestamps para que se agreguen como atributo a nuestro modelo. Esto añadirá 2
//* atributos nuevos: createdAt y updatedAt.

//* Creamos una función que se ejecuta antes de guardar el documento en la base de datos.
LibroSchema.pre("save", function (next) {
    //* Le asignamos una ID automática y aleatoria al libro.
    this.id = UUIDv4();
    next();
});

//* Generamos el Modelo
const Libro = mongoose.model("Libro", LibroSchema);

export default Libro;