import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { altaResponsable, listadoResponsables } from "../services/responsable.service"

const ObtenerResponsables = async (req:RequestExt,res:Response)=>{
    try{
        const idRol = req.user?.id_rol
        let idColegio = undefined;
        const idConsulta = req.user?.id

        if(idRol > 0){
            idColegio = req.user?.id_colegio
        }

        const listado = await listadoResponsables(idConsulta as string,idRol, idColegio)
        const data = {"data":listado,"mensaje":"Listado de responsables obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de responsables',e)    
    }
}

const AltaResponsable = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{ 
            
        const alta = await altaResponsable(req.body,transaction)
        const data = {"data":alta,
            "mensaje":"Responsable dado de alta",
            "log":`/ Responsable(id):${alta.id}`,
            "idColegio":`${alta.id_colegio}`}      

        await transaction.commit()
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el Responsable',e)    
    }
}



export {AltaResponsable, ObtenerResponsables}