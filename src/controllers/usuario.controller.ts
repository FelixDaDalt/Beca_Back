import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import { aceptarTyc, borrar, cambiarPassword, editar, me, obtenerTyc, obtenerUsuario, resetarPass, suspender} from "../services/usuario.service"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';


const CambiarPassword = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{ 
        const idUsuario = req.user?.id 
        const idRol = req.user?.id_rol
        const idColegio = req.user?.id_colegio
        const respuesta = await cambiarPassword(req.body.password,idUsuario,idRol,transaction)
        const data = {"data":respuesta,"mensaje":"Contraseña Actualizada"}

        await registrarEvento(
            idUsuario,
            idRol,
            idRol==0?0:1,
            idUsuario,
            "Password",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
        
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
        const idRol = req.user?.id_rol
        const idColegio = req.user?.id_colegio
        const pass = req.body?.password
        const aceptar = await aceptarTyc(idUsuario,pass,transaction)
        const data = {"data":aceptar,"mensaje":"Terminos y Condiciones Aceptados"}
        
        await registrarEvento(
            idUsuario,
            idRol,
            1,
            idUsuario,
            "Aceptar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
        
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
        
        const idColegio = req.user?.id_colegio
        const idUsuario = req.user?.id
        const data = {"data":alta,"mensaje":"Contraseña restablecida"}
        await registrarEvento(
            idUsuario,
            idRol,
            idRol==0?0:1,
            alta.id,
            "Reiniciar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
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
        const idRol = req.user?.id_rol
        const {id} = req.query   
        const usuario = await suspender(idRol, id as string,transaction)
        const data = {
            "data":usuario,
            mensaje: "Usuario " + (usuario.suspendido == 1 ? "Suspendido" : "Activado")
        }
        const idColegio = req.user?.id_colegio
        const idUsuario = req.user?.id 
        
        await registrarEvento(
            idUsuario,
            idRol,
            idRol==0?0:1,
            usuario.id,
            usuario.suspendido == 1?"Suspender":"Activar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
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
        const idRol = req.user?.id_rol
        const {id} = req.query   
        const usuario = await borrar(idRol, id as string,transaction)
        const data = {
            "data":usuario,
            mensaje: "Usuario Eliminado"
        }
        const idColegio = req.user?.id_colegio
        const idUsuario = req.user?.id 
        await registrarEvento(
            idUsuario,
            idRol,
            idRol==0?0:1,
            usuario.id,
            "Borrar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction,
            idColegio
        );
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar el usuario.',e)    
    }
}

const Editar = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{

        const idUsuario = req.user?.id
        const idColegio = req.user?.id_colegio
        const idRol = req.user?.id_rol
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/avatar/${file.filename}` : body.foto;

        const userConFoto = {
            usuario: {
                ...body.usuario,
                foto: fotoUrl,
            },
        };

          
        const usuario = await editar(userConFoto.usuario,idUsuario,idRol, transaction, idColegio)
        const data = {"data":usuario,mensaje: "Datos actualizado"}

        // const idColegio = req.user?.id_colegio
        // const idUsuario = req.user?.id 
        
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     idRol==0?0:1,
        //     usuario.id,
        //     usuario.suspendido == 1?"Suspender":"Activar",
        //     data.mensaje,
        //     requestIp.getClientIp(req) || 'No Disponible',
        //     req.headers['user-agent'] || 'No Disponible',
        //     transaction,
        //     idColegio
        // );
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al editar el usuario.',e)    
    }
}

const Me = async (req:RequestExt,res:Response)=>{
    try{
        const idUsuario = req.user?.id
        const usuario = await me(idUsuario)
        const data = {"data":usuario,"mensaje":"Usuario Encontrado"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener el usuario.',e)    
    }
}


export {CambiarPassword,AceptarTyc,ObtenerTyc, Suspender, ResetarPass,Obtener,Borrar,Editar,Me}