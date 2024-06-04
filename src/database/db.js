import mongoose from "mongoose";

//* Creamos nuestra clase DB
export class DB {
    //* Creamos los atributos URL, DB_NAME y IS_CONNECTED. Los dos primeros sacados de las
    //* variables de entorno (.env)
    url = process.env.DB_URL;
    db_name = process.env.DB_NAME;
    is_connected = false;

    constructor() {
        //* Aplicamos "Singleton" para conectar a la Base de Datos unicamente si no lo está ya.
        if (!this.is_connected) {
            //* Conectamos a la Base de Datos
            mongoose.connect(this.url, { dbName: this.db_name })
            .then(() => {
                console.log("Conectado a la Base de Datos.");
                this.is_connected = true;
            })
            .catch((error) => {
                console.log("Error al conectar a la Base de Datos.");
                console.log(error);
            });
        }
    }

    isConnected() {
        return this.is_connected;
    }
}

export default DB;