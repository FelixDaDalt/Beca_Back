import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { aceptarTyc, borrar, cambiarPassword, obtenerTyc, obtenerUsuario, resetarPass, suspender} from "../services/usuario.service"
import sequelize from "../config/database"
import { registrarActividad } from "../services/registro.service"



const CambiarPassword = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{ 
        const idUsuario = req.user?.id 
        const idRol = req.user?.id_rol
        const respuesta = await cambiarPassword(req.body.password,idUsuario,idRol,transaction)
        const data = {"data":respuesta,"mensaje":"Contraseña Actualizada"}

        const descripcionRegistro = `Contraseña Actualizada`;
        await registrarActividad(idUsuario, idRol, descripcionRegistro, transaction);
        await transaction.commit();

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al actualizar la contraseña',e)    
    }
}

const AceptarTyc = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const idUsuario = req.user?.id
        const pass = req.body?.password
        const aceptar = await aceptarTyc(idUsuario,pass,transaction)
        const data = {"data":aceptar,"mensaje":"Terminos y Condiciones Aceptados"}

        const idRol = req.user?.id_rol
        const descripcionRegistro = `Terminos y Condiciones Aceptados`;
        await registrarActividad(idUsuario, idRol, descripcionRegistro, transaction);
        await transaction.commit();
       
        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al aceptar los Terminos y Condiciones.',e)    
    }
}

const ObtenerTyc = async (req:RequestExt,res:Response)=>{
    try{   
        const tyc = await obtenerTyc()
        const data = {"data":tyc,"mensaje":"Terminos y Condiciones"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener los Terminos y Condiciones.',e)    
    }
}

const Obtener = async (req:RequestExt,res:Response)=>{
    try{
        const {idUsuario} = req.query   
        const usuario = await obtenerUsuario(idUsuario as string)
        const data = {"data":usuario,"mensaje":"Usuario Encontrado"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener el usuario.',e)    
    }
}





const ResetarPass = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{ 
        
        const idRol = req.user?.id_rol
        const { user, admin } = req.query;  

        const alta = await resetarPass(
            idRol,
            transaction,
            user as string | undefined,
            admin as string | undefined)
        
        const idAdmin = req.user?.id
        const data = {"data":alta,"mensaje":"Contraseña restablecida"}
        const descripcionRegistro = `Contraseña Reiniciada a DNI:  ${alta.dni} (id: ${alta.id})`;
       
        await registrarActividad(idAdmin, idRol, descripcionRegistro, transaction);
        await transaction.commit();

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al restablecer la contraseña',e)    
    }
}

const Suspender = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const id_rol = req.user?.id_rol
        const {id} = req.query   
        const usuario = await suspender(id_rol, id as string,transaction)
        const data = {
            "data":usuario,
            mensaje: "Usuario " + (usuario.suspendido == 1 ? "Suspendido: " : "Activado: ") + usuario.apellido+', '+usuario.nombre
        }

        const idAdmin = req.user?.id 
        const descripcionRegistro = `Usuario ${(usuario.suspendido == 1 ? "Suspendido: " : "Activado: ")}:  ${usuario.dni} (${usuario.id})`;
        await registrarActividad(idAdmin, id_rol, descripcionRegistro, transaction);
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el usuario.',e)    
    }
}

const Borrar = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const id_rol = req.user?.id_rol
        const {id} = req.query   
        const usuario = await borrar(id_rol, id as string,transaction)
        const data = {
            "data":usuario,
            mensaje: "Usuario Eliminado" + usuario.apellido+', '+usuario.nombre
        }

        const idAdmin = req.user?.id 
        const descripcionRegistro = `Usuario Eliminado:  ${usuario.dni} (ID: ${usuario.id})`;
        await registrarActividad(idAdmin, id_rol, descripcionRegistro, transaction);
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar el usuario.',e)    
    }
}


export {CambiarPassword,AceptarTyc,ObtenerTyc, Suspender, ResetarPass,Obtener,Borrar}