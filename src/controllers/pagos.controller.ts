import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { actualizarPagos, obtenerPagos } from "../services/pagos.service"



const ObtenerPagos= async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await obtenerPagos()
        const data = {"data":listado,"mensaje":"Formas de Pago Encontrado"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener Las formas de Pago',e)    
    }
}


const ActualizarPagos = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const plan = await actualizarPagos(req.body, transaction);
        const data = { "data": plan, "mensaje": "Forma de Pago Actualizado","log":`/ Forma de Pago(id):${plan.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al actualizar la Forma de Pago', e);
    }
};


export {ObtenerPagos,ActualizarPagos}