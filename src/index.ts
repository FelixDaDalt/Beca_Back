import express from "express";
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { routes } from "./routes";
import Sequelize from "./config/database";
import path from 'path';
import bodyParser from 'body-parser';
import registrarActividad from "./middleware/actividad";
import './tareas/tareas';

const cors = require('cors');

// Cargar el archivo .env correcto según el entorno
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.prod' });
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

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return next(); // Continuar si no es un método que modifica datos
  }

  // Guardamos la función original res.json
  const originalJson = res.json;

  res.json = function (body: any) {
      // Si la respuesta tiene un código de error, no registramos la actividad
      if (res.statusCode >= 400) {
          return originalJson.call(this, body);
      }

      // Llamamos a la respuesta original primero (para que el cliente la reciba)
      const result = originalJson.call(this, body);

      // Luego registramos la actividad sin bloquear la respuesta
      registrarActividad(req, res, body).catch((err) =>
          console.error('Error registrando actividad:', err)
      );

      return result; // Devolvemos el resultado original
  };

  next();
});

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
