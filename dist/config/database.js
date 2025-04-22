"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const init_models_1 = require("../models/init-models");
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: '.env.production' }); // Cargar el .env de producción
}
else {
    dotenv_1.default.config({ path: '.env.local' });
}
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    pool: {
        max: 20, // ✅ más conexiones
        min: 5,
        acquire: 60000, // ✅ 60 segundos
        idle: 10000
    },
    logging: false,
    timezone: '-03:00',
    dialectOptions: {
        timezone: 'Z', // Opcional si usas UTC
    },
});
(0, init_models_1.initModels)(sequelize);
exports.default = sequelize;
