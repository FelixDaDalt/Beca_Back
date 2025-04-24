import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import requestIp from 'request-ip';
import { altaAutorizado, borrarAutorizado, editarAutorizado, listadoAutorizados, obtenerAutorizado, suspenderAutorizado } from "../services/autorizados.service"



const ObtenerAutorizados = async (req:RequestExt,res:Response)=>{
    try{ 
        const id_colegio = req.user?.id_colegio
        const listado = await listadoAutorizados(id_colegio)
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
        const data = {"data":alta,
            "mensaje":"Autorizado dado de alta",
            "log":`/ Autorizado(id):${alta.id}`,
            "idColegio":idColegio}
                
        await transaction.commit()

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el Autorizado',e)    
    }
}

const ObtenerAutorizado = async (req:RequestExt,res:Response)=>{
    try{
        const {idAutorizado} = req.query
        const autorizado = await obtenerAutorizado(idAutorizado as string)
        const data = {"data":autorizado,"mensaje":"Autorizado Encontrado"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener el autorizado.',e)    
    }
}

const EditarAutorizado = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{

        const idUsuario = req.user?.id
        const idColegio = req.user?.id_colegio
        const idRol = req.user?.id_rol
          
        const usuario = await editarAutorizado(req.body,idUsuario,idRol, transaction, idColegio)
        const data = {"data":usuario,mensaje: "Datos actualizado","log":`/ Usuario(id):${usuario.id}`,
        "idColegio":`${idColegio}`}

        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al editar el autorizado.',e)    
    }
}

const SuspenderAutorizado = async (req:RequestExt,res:Response)=>{
    
    const transaction = await sequelize.transaction()
    
    try{
        const idColegio = req.user?.id_colegio
        const {idAutorizado} = req.query   
        const Autorizado = await suspenderAutorizado(idAutorizado as string,idColegio as string, transaction)
        const data = {
            "data":Autorizado,
            mensaje: "Autorizado " + (Autorizado.suspendido == 1 ? "Suspendido" : "Activado"),
            "log":`/ Usuario(id):${Autorizado.id}`,
            "idColegio":`${idColegio}`
        }

        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el usuario.',e)    
    }
}

const BorrarAutorizado = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const idColegio = req.user?.id_colegio
        const {idAutorizado} = req.query   
        const autorizado = await borrarAutorizado(idAutorizado as string,idColegio as string, transaction)
        const data = {
            "data":autorizado,
            mensaje: "Autorizado Eliminado",
            "log":`/ Autorizado(id):${autorizado.id}`,
            "idColegio":`${idColegio}`}
        
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar el Autorizado.',e)    
    }
}


export {ObtenerAutorizados, AltaAutorizado, EditarAutorizado, ObtenerAutorizado, SuspenderAutorizado, BorrarAutorizado}