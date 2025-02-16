"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const database_1 = __importDefault(require("./config/database"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const actividad_1 = __importDefault(require("./middleware/actividad"));
require("./tareas/tareas");
const cors = require('cors');
// Cargar el archivo .env correcto según el entorno
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: '.env.prod' });
}
else {
    dotenv_1.default.config({ path: '.env.local' });
}
const PORT = process.env.PORT || "3001"; // Hacer uso del puerto en .env o del 3001 por defecto
const app = (0, express_1.default)();
app.use(cors()); // Esto permite todos los orígenes y métodos de forma predeterminada
app.options('*', cors());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // Para poder recibir datos por el body
app.use(express_1.default.urlencoded({ extended: true })); // Para permitir el envío de datos por formulario
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use((req, res, next) => {
    if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return next(); // Continuar si no es un método que modifica datos
    }
    // Guardamos la función original res.json
    const originalJson = res.json;
    res.json = function (body) {
        // Si la respuesta tiene un código de error, no registramos la actividad
        if (res.statusCode >= 400) {
            return originalJson.call(this, body);
        }
        // Llamamos a la respuesta original primero (para que el cliente la reciba)
        const result = originalJson.call(this, body);
        // Luego registramos la actividad sin bloquear la respuesta
        (0, actividad_1.default)(req, res, body).catch((err) => console.error('Error registrando actividad:', err));
        return result; // Devolvemos el resultado original
    };
    next();
});
app.use(routes_1.routes);
app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`)); // Escucha el puerto e informa
// Verificar la conexión a la base de datos
database_1.default.authenticate()
    .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
})
    .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
});
