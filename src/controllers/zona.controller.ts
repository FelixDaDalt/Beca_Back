import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { actualizarLocalidad, actualizarZona, borrarLocalidad, borrarZona, nuevaLocalidad, nuevaZona, obtenerZonas } from "../services/zona.service"
import sequelize from "../config/database"



const ObtenerZonas = async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await obtenerZonas()
        const data = {"data":listado,"mensaje":"Zonas Encontradas"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener las Zonas',e)    
    }
}

const NuevaZona = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
       
        const zona = await nuevaZona(req.body, transaction);
        const data = { "data": zona, "mensaje": "Zona dada de alta","log":`/ Zona(id):${zona.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al crear la Zona', e);
    }
};

const NuevaLocalidad = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
       
        const localidad = await nuevaLocalidad(req.body, transaction);
        const data = { "data": localidad, "mensaje": "Localidad dada de alta","log":`/ Localidad(id):${localidad.id}` };

       

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al crear la Localidad', e);
    }
};

const ActualizarLocalidad = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const localidad = await actualizarLocalidad(req.body, transaction);
        const data = { "data": localidad, "mensaje": "Localidad Actualizada","log":`/ Localidad(id):${localidad.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al actualizar la Localidad', e);
    }
};

const ActualizarZona = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {

        const zona = await actualizarZona(req.body, transaction);
        const data = { "data": zona, "mensaje": "Zona Actualizada","log":`/ Zona(id):${zona.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al actualizar la Zona', e);
    }
};

const BorrarZona = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.query;
        const zona = await borrarZona(id as string, transaction);
        const data = { "data": zona, "mensaje": "Zona eliminada","log":`/ Zona(id):${zona.id}` };

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al borrar la Zona', e);
    }
};

const BorrarLocalidad = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.query;
        const localidad = await borrarLocalidad(id as string, transaction);
        const data = { "data": localidad, "mensaje": "Localidad eliminada","log":`/ Localidad(id):${localidad.id}` };


        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al borrar la Localidad', e);
    }
};




export {ObtenerZonas,NuevaZona,NuevaLocalidad, BorrarLocalidad,BorrarZona,ActualizarLocalidad,ActualizarZona}