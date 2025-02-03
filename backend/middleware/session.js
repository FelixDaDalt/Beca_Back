"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comprobarJWT = void 0;
const jw_handle_1 = require("../utils/jw.handle");
const error_handle_1 = require("../utils/error.handle");
const comprobarJWT = async (req, res, next) => {
    try {
        // Verifica que el token JWT esté presente en los headers
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const error = new Error('No se proporciono un token');
            error.statusCode = 401;
            throw error;
        }
        // Extrae el token (formato "Bearer <token>")
        const token = authHeader.split(' ')[1];
        if (!token || token === 'notvalid') {
            const error = new Error('Token no valido');
            error.statusCode = 401;
            throw error;
        }
        // Verifica el token utilizando tu función verificarToken
        const decodedUser = await (0, jw_handle_1.verificarToken)(token);
        if (!decodedUser) {
            const error = new Error('Token Invalido o Expirado');
            error.statusCode = 401;
            throw error;
        }
        // Si todo está bien, añadimos los datos del usuario al request
        req.user = decodedUser;
        // Continua con el siguiente middleware o ruta
        next();
    }
    catch (error) {
        error.statusCode = 401;
        (0, error_handle_1.handleHttp)(res, 'Error en el token', error);
    }
};
exports.comprobarJWT = comprobarJWT;
