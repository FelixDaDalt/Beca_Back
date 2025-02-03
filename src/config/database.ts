import { Sequelize } from 'sequelize-typescript';
import { initModels } from '../models/init-models';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' }); // Cargar el .env de producción
} else {
  dotenv.config({ path: '.env.local' });
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  dialect: 'mysql',
  logging: false,
});

initModels(sequelize)

export default sequelize;