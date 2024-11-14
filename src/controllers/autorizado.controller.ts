import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { registrarActividad } from "../services/registro.service"
import { altaAutorizado, listadoAutorizados } from "../services/autorizados.service"


const ObtenerAutorizados = async (req:RequestExt,res:Response)=>{
    try{ 
        const id_colegio = req.user?.id_colegio
        const idConsulta = req.user?.id
        const listado = await listadoAutorizados(idConsulta as string, id_colegio)
        const data = {"data":listado,"mensaje":"Listado de AUtorizados obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de Autorizados',e)    
    }
}

const AltaAutorizado = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 
        const idColegio = req.user?.id_colegio     
        const alta = await altaAutorizado(idColegio,req.body,transaction)
        const data = {"data":alta,"mensaje":"Delegado dado de alta"}

        const idAdmin = req.user?.id 
        const idRol = req.user?.id_rol
        
        const descripcionRegistro = `Alta de Autorizado DNI:  ${alta.dni} (ID: ${alta.id})`;
        await registrarActividad(idAdmin,idRol, descripcionRegistro, transaction);
        
        await transaction.commit()

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el Autorizado',e)    
    }
}



export {ObtenerAutorizados, AltaAutorizado}