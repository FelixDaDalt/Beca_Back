"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarRoles = void 0;
const error_handle_1 = require("../utils/error.handle");
const verificarRoles = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.id_rol;
            if (userRole === undefined) {
                (0, error_handle_1.handleHttp)(res, 'Error de autenticación', { statusCode: 401, message: 'Usuario no autenticado.' });
                return;
            }
            // Verifica si el rol del usuario está en la lista de roles permitidos
            if (!rolesPermitidos.includes(userRole)) {
                (0, error_handle_1.handleHttp)(res, 'Acceso denegado', { statusCode: 403, message: 'No tienes permisos para acceder a esta ruta.' });
                return;
            }
            // Si el rol es permitido, continúa
            next();
        }
        catch (error) {
            (0, error_handle_1.handleHttp)(res, 'Error de servidor', { statusCode: 500, message: 'Error al verificar el rol del usuario.' });
        }
    };
};
exports.verificarRoles = verificarRoles;
