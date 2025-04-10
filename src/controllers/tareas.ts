import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { notificarBecasPorVencer, notificarBecasVencidas, procesarBecasDadaBaja } from "../tareas/tareas"
import { obtenerEjecuciones } from "../services/tareas.service"



const ProcesarBajas= async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await procesarBecasDadaBaja();
        const data = {"data":listado,"mensaje":"Becas PENDIENTES DE BAJA procesadas correctamente.","log":`/ ID(id):${listado.id}`,}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al procesar las Becas PENDIENTES DE BAJA',e)    
    }
}

const ProcesarPorVencer= async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await notificarBecasPorVencer();
        const data = {"data":listado,"mensaje":"Becas POR VENCER procesadas correctamente.","log":`/ ID(id):${listado.id}`}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al procesar las Becas POR VENCER',e)    
    }
}

const ProcesarVencidas= async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await notificarBecasVencidas();
        const data = {"data":listado,"mensaje":"Becas VENCIDAS procesadas correctamente.","log":`/ ID(id):${listado.id}`}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al procesar las Becas VENCIDAS',e)    
    }
}

const ObtenerEjecuciones = async (req: Request, res: Response) => {
    try {
      const { page, pageSize, fechaDesde, fechaHasta, tipos } = req.query;
  
      const listado = await obtenerEjecuciones({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        fechaDesde: fechaDesde as string,
        fechaHasta: fechaHasta as string,
        tipos: tipos
        ? (Array.isArray(tipos) ? tipos.map(t => t.toString()) : [tipos.toString()])
        : undefined
      });
  
      const data = { data: listado, mensaje: "Ejecuciones encontradas correctamente." };
      res.status(200).send(data);
  
    } catch (e) {
      handleHttp(res, 'Error al obtener las ejecuciones', e);
    }
  };


export {ProcesarBajas,ProcesarPorVencer,ProcesarVencidas,ObtenerEjecuciones}