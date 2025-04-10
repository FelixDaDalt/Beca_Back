import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { obtenerNotificaciones } from "../services/notificacion.service"
import { obtenerNotificacionesAdmin } from "../services/notificacionesAdmin"




const NotificacionesAdmin = async (req: RequestExt, res: Response) => {
    try { 
        const idusuario = req.user?.id;
        const notificacionesEncontradas = await obtenerNotificacionesAdmin();
        const data = { "data": notificacionesEncontradas , "mensaje": "Listado de Notificaciones" };        
        res.status(200).send(data);
    } catch (e) {
        handleHttp(res, 'Error al obtener las notificaciones', e);    
    }
};


export {NotificacionesAdmin}