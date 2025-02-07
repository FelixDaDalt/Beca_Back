import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { altaColegio, borrarColegio, detalleColegio, editarColegio, listadoColegios, obtenerColegio, suspenderColegio } from "../services/colegio.service"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';


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
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/colegio/${file.filename}` : body.foto;

        const colegioConFoto = {
            colegio: {
                ...body.colegio,
                foto: fotoUrl,
            },
            usuario:{
                ...body.usuario
            }
        };

        const alta = await altaColegio(colegioConFoto,transaction)
        const data = {"data":alta,"mensaje":"Colegio dado de Alta"}

        const idUsuario = req.user?.id
        const idRol = req.user?.id_rol

        // Registrar evento para el alta del colegio
        await registrarEvento(
            idUsuario,
            idRol,
            2, 
            alta.colegio.responseColegio.id, 
            "Alta",  
            data.mensaje, 
            requestIp.getClientIp(req) || '',
            req.headers['user-agent'] || '',
            transaction,
            alta.colegio.responseColegio.id
        );

        const responsableRegistro = `Responsable dado de alta`;
        await registrarEvento(
            idUsuario,
            idRol,
            1, // Puedes cambiar el ID de la entidad tipo si es necesario
            alta.responsable.responseUsuario.id,  // El ID del administrador (responsable)
            "Alta",  // La acción realizada
            responsableRegistro,  // Descripción de la acción
            requestIp.getClientIp(req) || '',
            req.headers['user-agent'] || '',
            transaction,
            alta.colegio.responseColegio.id
        );

        await transaction.commit()
        
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al dar de alta el colegio',e)    
    }
}

const EditarColegio = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/colegio/${file.filename}` : body.foto;

        const colegioConFoto = {
                ...body.colegio,
                foto: fotoUrl,
        };
        console.log(colegioConFoto)

        const alta = await editarColegio(colegioConFoto,transaction)
        const data = {"data":alta.editar,"mensaje":"Colegio Actualizado"}

        const idUsuario = req.user?.id
        const idRol = req.user?.id_rol

        // // Registrar evento para el alta del colegio
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     2, 
        //     alta.colegio.responseColegio.id, 
        //     "Alta",  
        //     data.mensaje, 
        //     requestIp.getClientIp(req) || '',
        //     req.headers['user-agent'] || '',
        //     transaction,
        //     alta.colegio.responseColegio.id
        // );

        // const responsableRegistro = `Responsable dado de alta`;
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     1, // Puedes cambiar el ID de la entidad tipo si es necesario
        //     alta.responsable.responseUsuario.id,  // El ID del administrador (responsable)
        //     "Alta",  // La acción realizada
        //     responsableRegistro,  // Descripción de la acción
        //     requestIp.getClientIp(req) || '',
        //     req.headers['user-agent'] || '',
        //     transaction,
        //     alta.colegio.responseColegio.id
        // );

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
            mensaje: "Colegio " + (colegio.suspendido == 1 ? "Suspendido" : "Activado")
        }

        const idUsuario = req.user?.id 
        const idRol = req.user?.id_rol
        
        await registrarEvento(
            idUsuario,
            idRol,
            2,
            colegio.id,
            colegio.suspendido == 1 ? "Suspender" : "Activar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            colegio.id
        );
        
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

const BorrarColegio = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction();
    try{ 
        const idUsuario = req.user?.id 
        const { idColegio } = req.query; 
        const colegio = await borrarColegio(idColegio as string,idUsuario,transaction)
        const data = {
            "data":colegio,
            mensaje: "Colegio Eliminado"
        }
        await transaction.commit()
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el colegio',e)    
    }
}

export {ObtenerColegio, AltaColegio, SuspenderColegio, ObtenerColegios,DetalleColegio, BorrarColegio,EditarColegio}