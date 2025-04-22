import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { obtenerResumenDashboard } from "../services/dashboard.service"




const Dashboard = async (req: RequestExt, res: Response) => {
    try { 
        const notificacionesEncontradas = await obtenerResumenDashboard();
        const data = { "data": notificacionesEncontradas , "mensaje": "Dashboard obtenido" };
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        handleHttp(res, 'Error al obtener el Dashboard', e);    
    }
};


export {Dashboard }