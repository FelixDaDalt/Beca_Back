import { NextFunction,Response } from "express";
import { RequestExt } from "./session";

const comprobarResponsable = (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        if (req.user && req.user.id_rol === 1) { 
            next(); // Si es administrador, continua
        } else {
            res.status(403).send("NO_TIENE_PERMISO"); // Si no es administrador, deniega el acceso
        }
    } catch (e) {
        res.status(403).send("ERROR_EN_AUTORIZACION");
    }
};

export{comprobarResponsable}