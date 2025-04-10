import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { actualizarLocalidad, actualizarZona, borrarLocalidad, borrarZona, nuevaLocalidad, nuevaZona, obtenerZonas } from "../services/zona.service"
import sequelize from "../config/database"
import { actualizarPlan, borrarPlan, nuevoPlan, obtenerPlanes } from "../services/plan.service"



const ObtenerPlanes= async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await obtenerPlanes()
        const data = {"data":listado,"mensaje":"Zonas Encontradas"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener las Zonas',e)    
    }
}

const NuevoPlan = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
       
        const plan = await nuevoPlan(req.body, transaction);
        const data = { "data": plan, "mensaje": "Plan dado de alta","log":`/ Plan(id):${plan.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al crear el Plan', e);
    }
};

const ActualizarPlan = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const plan = await actualizarPlan(req.body, transaction);
        const data = { "data": plan, "mensaje": "Plan Actualizado","log":`/ Plan(id):${plan.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al actualizar el Plan', e);
    }
};

const BorrarPlan= async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.query;
        const plan = await borrarPlan(id as string, transaction);
        const data = { "data": plan, "mensaje": "Plan eliminado","log":`/ Zona(id):${plan.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al borrar el Plan', e);
    }
};


export {ObtenerPlanes,NuevoPlan,ActualizarPlan,BorrarPlan}