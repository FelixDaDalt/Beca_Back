import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { actualizarParametro, obtenerParametros } from "../services/parametros.service"



const ObtenerParametros = async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await obtenerParametros()
        const data = {"data":listado,"mensaje":"Zonas Encontradas"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener las Zonas',e)    
    }
}

const ActualizarParametro = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const parametro = await actualizarParametro(req.body, transaction);
        const data = { "data": parametro, "mensaje": "Parametro Actualizado","log":`/ Parametro(id):${parametro.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al actualizar la Zona', e);
    }
};


export {ObtenerParametros,ActualizarParametro}