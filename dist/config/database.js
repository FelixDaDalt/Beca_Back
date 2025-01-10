"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const init_models_1 = require("../models/init-models");
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
});
(0, init_models_1.initModels)(sequelize);
exports.default = sequelize;
