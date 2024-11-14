import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { altaAdministrador,borrarAdministrador,comprobarDisponibilidad, listadoAdministradores, listadoTyc, nuevoTyc, obtenerAdministrador, suspenderAdministrador} from "../services/admin.service"
import { RequestExt } from "../middleware/session"
import { registrarActividad } from "../services/registro.service"
import sequelize from "../config/database"


//ADMINISTRADORES
const AltaAdministrador = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction();   
    try{        
        const alta = await altaAdministrador(req.body,transaction)
        const data = {"data":alta,"mensaje":"Administrador dado de alta"}

        const idusuario = req.user?.id
        const idrol = req.user?.id_rol
        const descripcionRegistro = `Alta de administrador DNI:  ${alta.dni} (ID: ${alta.id})`;
        await registrarActividad(idusuario,idrol, descripcionRegistro,transaction);
        
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
        const id_rol = req.user?.id_rol
        const {idAdmin} = req.query   
        const administrador = await suspenderAdministrador(id_rol, idAdmin as string,transaction)
        const data = {
            "data":administrador,
            mensaje: "Usuario " + (administrador.suspendido == 1 ? "Suspendido: " : "Activado: ") + administrador.apellido+', '+administrador.nombre
        }

        const idAdminReg = req.user?.id 
        const descripcionRegistro = `Administrador ${(administrador.suspendido == 1 ? "Suspendido: " : "Activado: ")}:  ${administrador.dni} (ID: ${administrador.id})`;
        await registrarActividad(idAdminReg, id_rol, descripcionRegistro, transaction);
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
        const id_rol = req.user?.id_rol
        const {idAdmin} = req.query   
        const administrador = await borrarAdministrador(id_rol, idAdmin as string,transaction)
        const data = {
            "data":administrador,
            mensaje: "Administrador Eliminado:" + administrador.apellido+', '+administrador.nombre
        }

        const idAdminReg = req.user?.id 
        const descripcionRegistro = `Administrador Eliminado:  ${administrador.dni} (ID: ${administrador.id})`;
        await registrarActividad(idAdminReg, id_rol, descripcionRegistro, transaction);
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
        const alta = await nuevoTyc(req.body,transaction)
        const data = {"data":alta,"mensaje":"Nuevos Terminos y Condiciones creado"}

        const idusuario = req.user?.id
        const idrol = req.user?.id_rol
        const descripcionRegistro = `Terminos y Condiciones Creado ID: ${alta.id}`;
        
        await registrarActividad(idusuario,idrol, descripcionRegistro,transaction);

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




export {ListadoTyc, NuevoTyc, AltaAdministrador, Comprobar, ObtenerAdministradores,SuspenderAdministrador,ObtenerAdministrador,BorrarAdministrador}