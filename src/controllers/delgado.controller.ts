import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { altaDelegado, listadoDelegados } from "../services/delegado.service"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';


const ObtenerDelegados = async (req:RequestExt,res:Response)=>{
    try{ 
        const id_colegio = req.user?.id_colegio
        const idConsulta = req.user?.id
        const listado = await listadoDelegados(idConsulta as string, id_colegio)
        const data = {"data":listado,"mensaje":"Listado de Delegados obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de Delegados',e)    
    }
}

const AltaDelegado = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 
        const idColegio = req.user?.id_colegio     
        const alta = await altaDelegado(idColegio,req.body,transaction)
        const data = {"data":alta,"mensaje":"Delegado dado de alta"}
        
        const idRol = req.user?.id_rol
        const idUsuario = req.user?.id
        
        await registrarEvento(
            idUsuario,
            idRol,
            1,
            alta.id,
            "Alta",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
        
        await transaction.commit()

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el Delegado',e)    
    }
}



export {ObtenerDelegados, AltaDelegado}