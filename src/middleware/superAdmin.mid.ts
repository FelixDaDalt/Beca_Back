import { NextFunction,Response } from "express";
import { RequestExt } from "./session";
import { handleHttp } from "../utils/error.handle";

const superAdminRol = () => {
    return (req: RequestExt, res: Response, next: NextFunction): void => {
        try {
            const userSuperAdmin = req.user?.superAdmin;

            if (userSuperAdmin === undefined || !userSuperAdmin) {
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
export{superAdminRol}