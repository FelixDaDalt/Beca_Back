import { Sequelize } from 'sequelize-typescript';
import { initModels } from '../models/init-models';

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