import { Request,Response,NextFunction } from "express"
import { verificarToken } from "../utils/jw.handle"
import { JwtPayload } from "jsonwebtoken"
import { handleHttp } from "../utils/error.handle";


export interface RequestExt extends Request {
    user?: {
        id: string | number;
        id_rol: number;
        fecha_ingreso: string;
        dni: string;
        id_colegio:string | null;
    } | JwtPayload;
}

const comprobarJWT=async (req:RequestExt,res:Response,next:NextFunction)=>{
    try {
        // Verifica que el token JWT esté presente en los headers
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const error = new Error('No se proporciono un token');
            (error as any).statusCode = 401; 
            throw error;
        }
    
        // Extrae el token (formato "Bearer <token>")
        const token = authHeader.split(' ')[1]; 
        if (!token || token === 'notvalid') {
            const error = new Error('Token no valido');
            (error as any).statusCode = 401; 
            throw error;
        }
    
        // Verifica el token utilizando tu función verificarToken
        const decodedUser = await verificarToken(token);
        
        if (!decodedUser) {
            const error = new Error('Token Invalido o Expirado');
            (error as any).statusCode = 401; 
            throw error;
        }
    
        // Si todo está bien, añadimos los datos del usuario al request
        req.user = decodedUser as RequestExt['user'];
    
        // Continua con el siguiente middleware o ruta
        next();
     } catch (error) {
        (error as any).statusCode = 401; 
        handleHttp(res, 'Error en el token', error);
    }
}

export{comprobarJWT}

