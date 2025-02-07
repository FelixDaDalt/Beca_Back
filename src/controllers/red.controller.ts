import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { altaRed, borrarMiembro, borrarRed, colegiosDisponibles, editarDatosRed, editarMiembrosRed, listadoRedes, meRed, obtenerMiembros, obtenerRed } from "../services/red.service"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';

const ObtenerRed = async (req:RequestExt,res:Response)=>{
    try{ 
        const {idRed} = req.query 
        const listado = await obtenerRed(idRed as string)
        const data = {"data":listado,"mensaje":"Red Encontrada"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtenerla Red',e)    
    }
}

const AltaRed = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/redes/${file.filename}` : null;
        const colegios = JSON.parse(body.colegios);
        const redConFoto = {
            red: {
              ...body.red,
              foto: fotoUrl,
            },
            colegios
          };

        const redCreada = await altaRed(redConFoto, transaction);
        const data = { "data": redCreada, "mensaje": "Red dada de Alta" };

        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;

        await registrarEvento(
            idUsuario,
            idRol,
            3, 
            redCreada.id, 
            "Alta",  
            data.mensaje,  
            requestIp.getClientIp(req) || '',
            req.headers['user-agent'] || '',
            transaction
        );

        const registrosColegios = colegios.map((colegio: { id: number, anfitrion: number }) => {
            // Definir la descripción según si es anfitrión o no
            const descripcion = colegio.anfitrion === 1 
                ? `Colegio asignado como Anfitrión en la red ${redCreada.nombre}, ID:${redCreada.id}` 
                : `Colegio vinculado como Miembro en la red ${redCreada.nombre}, ID:${redCreada.id}`;  
            
            return registrarEvento(
                idUsuario,
                idRol,
                2, 
                colegio.id,
                colegio.anfitrion === 1?"Anfitrion":'Miembro',
                descripcion, 
                requestIp.getClientIp(req) || '',
                req.headers['user-agent'] || '',
                transaction,
                colegio.id
            );
        });

        await Promise.all(registrosColegios)

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al dar de alta la Red', e);    
    }
};

const ObtenerRedes = async (req:RequestExt,res:Response)=>{
    try{
        let idColegio = undefined
        const idRol = req.user?.id_rol
        if(idRol>0){
            idColegio = req.user?.id_colegio
        }

        const listado = await listadoRedes(idColegio)
        const data = {"data":listado,"mensaje":"Listado de Redes obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de Redes',e)    
    }
}

const BorrarRed = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        const {idRed} = req.query   
        const red = await borrarRed(idRed as string,transaction)
        const data = {"data":red, mensaje: "Red Eliminada"}

        const idRol = req.user?.id_rol
        const idUsuario = req.user?.id
        await registrarEvento(
            idUsuario,
            idRol,
            3,
            red.id,
            "Borrar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction
        );
       //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar la Red.',e)    
    }
}

const EditarDatosRed = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {

        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio

        const { body, file } = req;
        const fotoUrl = file ? `/uploads/redes/${file.filename}` : body.foto;

        const redConFoto = {
            red: {
                ...body.red,
                foto: fotoUrl,
            },
        };

        const { datosRed, estadoAnterior} = await editarDatosRed(redConFoto.red,
            idRol,
            idColegio,
            transaction
        );

        const data = {"data":datosRed, mensaje: "Red Actualizada"}
        
        await registrarEvento(
            idUsuario,
            idRol,
            3,
            datosRed.id,
            "Editar",
            `Red editada ${datosRed.nombre}. ${JSON.stringify(estadoAnterior)}`,
            requestIp.getClientIp(req) || '',
            req.headers['user-agent'] || '',
            transaction,
            idColegio,
        );
       
        await transaction.commit();
        res.status(200).send(data);
    } catch (error) {
        await transaction.rollback();
        handleHttp(res, 'Error al editar la Red', error);
    }
};

const EditarMiembrosRed = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio

        const {red,colegiosAActualizar, colegiosANuevos} = await editarMiembrosRed(req.body,
            idRol,
            idColegio,
            transaction
        );

        const data = {"data":colegiosAActualizar, colegiosANuevos, mensaje: "Miembros Actualizados"}
        
        if (colegiosAActualizar.length > 0) {
            for (const colegio of colegiosAActualizar) {
                await registrarEvento(
                    idUsuario,
                    idRol,
                    2,
                    colegio,
                    "Miembro",
                    `Colegio vinculado como Miembro en la red ${red.nombre}`,
                    requestIp.getClientIp(req) || '',
                    req.headers['user-agent'] || '',
                    transaction,
                    idColegio,
                );
            }
        }

        if (colegiosANuevos.length > 0) {
            for (const colegio of colegiosANuevos) {
                await registrarEvento(
                    idUsuario,
                    idRol,
                    2,
                    colegio.id_colegio,
                    "Miembro",
                    `Colegio vinculado como Miembro en la red ${red.nombre}`,
                    requestIp.getClientIp(req) || '',
                    req.headers['user-agent'] || '',
                    transaction,
                    idColegio,
                );
            }
        }
        
        
       
        await transaction.commit();
        res.status(200).send(data);
    } catch (error) {
        await transaction.rollback();
        handleHttp(res, 'Error al editar la Red', error);
    }
};

const ColegiosDisponibles = async (req:RequestExt,res:Response)=>{
    try{ 
        const {idRed} = req.query 
        const listado = await colegiosDisponibles(idRed as string)
        const data = {"data":listado,"mensaje":"Red Encontrada"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtenerla Red',e)    
    }
}

const BorrarMiembro = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        const {idRed} = req.query
        const {idColegio} = req.query    
        const miembro = await borrarMiembro(idRed as string,idColegio as string, transaction)
        const data = {"data":miembro, mensaje: "Miembro eliminado"}

        const idRol = req.user?.id_rol
        const idUsuario = req.user?.id
        await registrarEvento(
            idUsuario,
            idRol,
            2,
            miembro.id_colegio,
            "Borrar",
            data.mensaje,
            requestIp.getClientIp(req) || 'No Disponible',
            req.headers['user-agent'] || 'No Disponible',
            transaction
        );
       //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar la Red.',e)    
    }
}


/// MIEMBROS
const Me = async (req:RequestExt,res:Response)=>{
    try{
        const {idRed} = req.query 
        const idColegio = req.user?.id_colegio
        const me = await meRed(idRed as string, idColegio)
        const data = {"data":me,"mensaje":"Datos red Encontrados"}
        res.status(200).send(data)       
    }catch(e){
        handleHttp(res,'Error al obtener los datos en la red.',e)    
    }
}


const ObtenerMiembros = async (req:RequestExt,res:Response)=>{
    try{ 
        const {idRed} = req.query
        const rol = req.user?.id_rol; 
        const listado = await obtenerMiembros(idRed as string,rol)
        const data = {"data":listado,"mensaje":"Miembros encontrados"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtenerla los miembros',e)    
    }
}

export {AltaRed,ObtenerRedes,BorrarRed, EditarDatosRed, ObtenerRed,ColegiosDisponibles,BorrarMiembro,EditarMiembrosRed,ObtenerMiembros, Me}