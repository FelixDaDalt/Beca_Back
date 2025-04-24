import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { borrarReporte, listadoReportes, nuevoReporte } from "../services/reporte.service";



const ObtenerReportes = async (req:RequestExt,res:Response)=>{
    try{ 
        const { page, pageSize, fechaDesde, fechaHasta, tipos } = req.query;
          
              const listado = await listadoReportes({
                page: Number(page) || 1,
                pageSize: Number(pageSize) || 10,
                fechaDesde: fechaDesde as string,
                fechaHasta: fechaHasta as string,
              });

        const data = {"data":listado,"mensaje":"Listado de Reportes obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de Reportes',e)    
    }
}

const NuevoReporte = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 
        const idUsuario = req.user?.id    
        const reporte = await nuevoReporte(idUsuario,req.body,transaction)
        const data = {"data":reporte,
            "mensaje":"Nuevo Reporte registrado",
            "log":`/ Usuario(id):${reporte.id_usuario}`}
                
        await transaction.commit()

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al registrar el Reporte',e)    
    }
}

const BorrarReporte = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const idUsuario = req.user?.id
        const {idReporte} = req.query   
        const reporte = await borrarReporte(idReporte as string, transaction)
        const data = {
            "data":reporte,
            mensaje: "Reporte Eliminado",
            "log":`/ Reporte(id):${reporte.id}`}
        
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar el Reporte.',e)    
    }
}


export {ObtenerReportes,NuevoReporte,BorrarReporte}