import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { altaAdministrador,borrarAdministrador,comprobarDisponibilidad, listadoAdministradores, listadoTyc, nuevoTyc, obtenerAdministrador, suspenderAdministrador,me, actualizar} from "../services/admin.service"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import requestIp from 'request-ip';

//ADMINISTRADORES
const AltaAdministrador = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction();   
    try{        
        const alta = await altaAdministrador(req.body,transaction)
        const data = {"data":alta,"mensaje":"Administrador dado de alta","log":`/ Administrador(id):${alta.id}`}

        await transaction.commit(); 
        
        res.status(200).send(data);
    }catch(e){
        await transaction.rollback();
        handleHttp(res,'Error al dar de alta el administrador',e)    
    }
}

const ObtenerAdministradores = async (req:RequestExt,res:Response)=>{
    try{ 
        const idConsulta = req.user?.id
        const listado = await listadoAdministradores(idConsulta as string)
        const data = {"data":listado,"mensaje":"Listado de administradores obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de administradores',e)    
    }
}

const SuspenderAdministrador = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{

        const idRol = req.user?.id_rol
        const {idAdmin} = req.query   
        const adminSuspendido = await suspenderAdministrador(idRol, idAdmin as string,transaction)
        const data = {
            "data":adminSuspendido,
            mensaje: "Administrador " + (adminSuspendido.suspendido == 1 ? "Suspendido " : "Activado ")
            ,"log":`/ Administrador(id):${adminSuspendido.id}`
        }

        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el Administrador.',e)    
    }
}

const BorrarAdministrador = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{

        const idRol = req.user?.id_rol
        const {idAdmin} = req.query   

        const adminBorrado = await borrarAdministrador(idRol, idAdmin as string,transaction)
        const data = {
            "data":adminBorrado,
            mensaje: "Administrador Eliminado",
            "log":`/ Administrador(id):${adminBorrado.id}`
        }

        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar el Administrador.',e)    
    }
}

const ObtenerAdministrador = async (req:RequestExt,res:Response)=>{
    try{
        const {idAdmin} = req.query   
        const administrador = await obtenerAdministrador(idAdmin as string)
        const data = {"data":administrador,"mensaje":"Administrador Encontrado"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener el Administrador.',e)    
    }
}

const Actualizar = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{

        const idUsuario = req.user?.id
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/avatar/${file.filename}` : body.foto;

        const userConFoto = {
            usuario: {
                ...body.usuario,
                foto: fotoUrl,
            },
        };
          
        const usuario = await actualizar(userConFoto.usuario,idUsuario,transaction)

        const data = {"data":usuario,mensaje: "Datos actualizado","log":`/ Administrador(id):${usuario.id}`}

        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al suspender el usuario.',e)    
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

//OTROS
const Comprobar = async (req:RequestExt,res:Response)=>{
    try{ 
        const { cuit, dni, url, dniAdmin } = req.query;    
        const comprobacion = await comprobarDisponibilidad(
            cuit as string | undefined,
            dni as string | undefined,
            url as string | undefined,
            dniAdmin as string | undefined)
        res.status(200).send(comprobacion);
    }catch(e){
        handleHttp(res,'Error al comprobar',e)    
    }
}

const NuevoTyc = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction(); 
    try{ 

        const altaTyc = await nuevoTyc(req.body,transaction)
        const data = 
        {
            "data":altaTyc,
            "mensaje":"Nuevos Terminos y Condiciones creado",
            "log":`/ Tyc(id):${altaTyc.id}`,}
        
        await transaction.commit()

        res.status(200).send(data);
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al guardar los nuevos Terminos y Condiciones',e)    
    }
}

const ListadoTyc = async (req:RequestExt,res:Response)=>{
    try{ 
        const listado = await listadoTyc()
        const data = {"data":listado,"mensaje":"Listado de Terminos y Condiciones"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener listado de Terminos y Condiciones',e)    
    }
}




export {ListadoTyc, NuevoTyc, AltaAdministrador, Comprobar, ObtenerAdministradores,SuspenderAdministrador,ObtenerAdministrador,BorrarAdministrador,Me,Actualizar}