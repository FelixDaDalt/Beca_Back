import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { registrosAdmin, registrosPorColegio } from "../services/registro.service"



const ObtenerRegistros = async (req:RequestExt,res:Response)=>{
    try{
        const idRol = req.user?.id_rol;
        let idColegio = req.query.idColegio;
        if (idRol > 0) {
            idColegio = req.user?.id_colegio;
        }

        const listado = await registrosPorColegio(idColegio as string, idRol);
        const data = {"data":listado,"mensaje":"Registro obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener los registros',e)    
    }
}

const ObtenerRegistrosAdmin= async (req:RequestExt,res:Response)=>{
    try{
        const listado = await registrosAdmin();
        const data = {"data":listado,"mensaje":"Registro obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener los registros',e)    
    }
}



export {ObtenerRegistros,ObtenerRegistrosAdmin}