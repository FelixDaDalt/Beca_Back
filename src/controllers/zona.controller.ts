import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { actualizarLocalidad, actualizarZona, borrarLocalidad, borrarZona, nuevaLocalidad, nuevaZona, obtenerZonas } from "../services/zona.service"
import sequelize from "../config/database"
import { registrarActividad } from "../services/registro.service"


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
        const data = { "data": zona, "mensaje": "Zona creada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Creación de nueva zona: ${zona.nombre} (ID: ${zona.id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

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
        const data = { "data": localidad, "mensaje": "Localidad creada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Creación de nueva localidad: ${localidad.nombre} (ID: ${localidad.id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

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
        const data = { "data": localidad, "mensaje": "Localidad Actualizada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Actualización de localidad: ${localidad.nombre} (ID: ${localidad.id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

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
        const data = { "data": zona, "mensaje": "Zona Actualizada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Actualización de zona: ${zona.nombre} (ID: ${zona.id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

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
        const data = { "data": zona, "mensaje": "Zona eliminada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Eliminación de zona: ${zona.nombre} (ID: ${id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

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
        const data = { "data": localidad, "mensaje": "Localidad eliminada" };

        const idAdmin = req.user?.id;
        const idRol = req.user?.id_rol;
        const descripcionRegistro = `Eliminación de localidad: ${localidad.nombre} (ID: ${id})`;
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);

        await transaction.commit();
        res.status(200).send(data);
    } catch (e) {
        await transaction.rollback();
        handleHttp(res, 'Error al borrar la Localidad', e);
    }
};




export {ObtenerZonas,NuevaZona,NuevaLocalidad, BorrarLocalidad,BorrarZona,ActualizarLocalidad,ActualizarZona}