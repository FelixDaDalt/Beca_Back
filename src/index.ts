import express from "express"
import dotenv from 'dotenv'
dotenv.config()
import { routes } from "./routes"
import Sequelize from "./config/database"
import path from 'path';
import bodyParser from 'body-parser'

const PORT = process.env.PORT || "3001" //hace uso del puerto en .env o del 3001
const cors = require('cors');

const app = express() 
app.use(cors()); // Esto permite todos los orígenes y métodos de forma predeterminada
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()) //para poder recibir datos por el body
app.use(express.urlencoded({ extended: true })); // Para permitir el envío de datos por formulario
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(routes)
app.listen(PORT,() => console.log(`Escuchando ${PORT}`)) //escucha el puerto e informa

// Verificar la conexión a la base de datos
  Sequelize.authenticate()
    .then(() => {
      console.log('Conexión a la base de datos establecida correctamente.');
    })
    .catch((err:any) => {
      console.error('Error al conectar con la base de datos:', err);
    });