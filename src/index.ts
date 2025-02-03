import express from "express";
import dotenv from 'dotenv';
import { routes } from "./routes";
import Sequelize from "./config/database";
import path from 'path';
import bodyParser from 'body-parser';

const cors = require('cors');

// Cargar el archivo .env correcto según el entorno
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.local' });
}

const PORT = process.env.PORT || "3001"; // Hacer uso del puerto en .env o del 3001 por defecto

const app = express();
app.use(cors()); // Esto permite todos los orígenes y métodos de forma predeterminada
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Para poder recibir datos por el body
app.use(express.urlencoded({ extended: true })); // Para permitir el envío de datos por formulario
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(routes);

app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`)); // Escucha el puerto e informa

// Verificar la conexión a la base de datos
Sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch((err: any) => {
    console.error('Error al conectar con la base de datos:', err);
  });
