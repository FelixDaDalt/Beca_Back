import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { obtenerNotificaciones } from "../services/notificacion.service"




const Notificaciones = async (req: RequestExt, res: Response) => {
    try { 
        const idusuario = req.user?.id;
        const idrol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const notificacionesEncontradas = await obtenerNotificaciones(idusuario,idrol,idColegio);
        const data = { "data": notificacionesEncontradas , "mensaje": "Listado de Notificaciones" };
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        handleHttp(res, 'Error al obtener las notificaciones', e);    
    }
};


export {Notificaciones}