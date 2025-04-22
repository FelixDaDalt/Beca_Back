import { NextFunction,Response } from "express";
import { RequestExt } from "./session";
import { handleHttp } from "../utils/error.handle";

const verificarRoles = (rolesPermitidos: number[]) => {
    return (req: RequestExt, res: Response, next: NextFunction): void => {
        try {
            const userRole = req.user?.id_rol;

            if (userRole === undefined) {
                handleHttp(res, 'Error de autenticación', { statusCode: 401, message: 'Usuario no autenticado.' });
                return;
            }

            // Verifica si el rol del usuario está en la lista de roles permitidos
            if (!rolesPermitidos.includes(userRole)) {
                handleHttp(res, 'Acceso denegado', { statusCode: 403, message: 'No tienes permisos para acceder a esta ruta.' });
                return;
            }

            // Si el rol es permitido, continúa
            next();
        } catch (error) {
            handleHttp(res, 'Error de servidor', { statusCode: 500, message: 'Error al verificar el rol del usuario.' }); 
        }
    };
};
export{verificarRoles}