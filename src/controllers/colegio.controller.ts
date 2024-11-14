import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { altaColegio, detalleColegio, listadoColegios, obtenerColegio, suspenderColegio } from "../services/colegio.service"
import sequelize from "../config/database"
import { registrarActividad } from "../services/registro.service"


const ObtenerColegio = async (req:RequestExt,res:Response)=>{
    try{ 
        const idColegio = req.user?.id_colegio 
        const listado = await obtenerColegio(idColegio)
        const data = {"data":listado,"mensaje":"Colegio Encontrado"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el colegio',e)    
    }
}

const AltaColegio = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 
        const alta = await altaColegio(req.body,transaction)
        const data = {"data":alta,"mensaje":"Colegio dado de Alta"}

        const idusuario = req.user?.id
        const idrol = req.user?.id_rol

        const colegioRegistro = `Alta de colegio CUIT: ${alta.colegio.responseColegio.cuit} (id: ${alta.colegio.responseColegio.id})`;
        await registrarActividad(idusuario,idrol, colegioRegistro,transaction);
        const responsableRegistro = `Alta de responsable DNI: ${alta.responsable.responseUsuario.dni} (id: ${alta.responsable.responseUsuario.id})`;
        await registrarActividad(idusuario,idrol, responsableRegistro,transaction);

        await transaction.commit()
        
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el colegio',e)    
    }
}

const ObtenerColegios = async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await listadoColegios()
        const data = {"data":listado,"mensaje":"Listado de colegios obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de colegios',e)    
    }
}

const SuspenderColegio = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction();
    try{ 
        const { idColegio } = req.query; 
        const colegio = await suspenderColegio(idColegio as string,transaction)
        const data = {
            "data":colegio,
            mensaje: "Colegio " + (colegio.suspendido == 1 ? "Suspension " : "Activacion ") + colegio.nombre
        }

        const idAdmin = req.user?.id 
        const idRol = req.user?.id_rol
        
        const descripcionRegistro = `${(colegio.suspendido == 1 ? "Suspension " : "Activacion ")} de colegio:  ${colegio.cuit} (${colegio.id})`;
        await registrarActividad(idAdmin,idRol, descripcionRegistro, transaction);
        
        await transaction.commit()
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el colegio',e)    
    }
}

const DetalleColegio = async (req:RequestExt,res:Response)=>{
    try{ 
        const idRol = req.user?.id_rol;
        let idColegio = req.query.id
        if (idRol > 0) {
            idColegio = req.user?.id_colegio
        }

        const detalle = await detalleColegio(idColegio as string)
        const data = {"data":detalle,"mensaje":"Detalle del colegio"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el Detalle del colegio',e)    
    }
}

export {ObtenerColegio, AltaColegio, SuspenderColegio, ObtenerColegios,DetalleColegio}