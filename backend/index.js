"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routes_1 = require("./routes");
const database_1 = __importDefault(require("./config/database"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || "3001"; //hace uso del puerto en .env o del 3001
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors()); // Esto permite todos los orígenes y métodos de forma predeterminada
app.options('*', cors());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); //para poder recibir datos por el body
app.use(express_1.default.urlencoded({ extended: true })); // Para permitir el envío de datos por formulario
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use(routes_1.routes);
app.listen(PORT, () => console.log(`Escuchando ${PORT}`)); //escucha el puerto e informa
// Verificar la conexión a la base de datos
database_1.default.authenticate()
    .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
})
    .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
});
