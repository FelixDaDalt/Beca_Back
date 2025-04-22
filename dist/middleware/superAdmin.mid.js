"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminRol = void 0;
const error_handle_1 = require("../utils/error.handle");
const superAdminRol = () => {
    return (req, res, next) => {
        try {
            const userSuperAdmin = req.user?.superAdmin;
            if (userSuperAdmin === undefined || !userSuperAdmin) {
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
exports.superAdminRol = superAdminRol;
