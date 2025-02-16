import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { altaRed, borrarMiembro, borrarRed, colegiosDisponibles, editarDatosRed, editarMiembrosRed, listadoRedes, meRed, obtenerMiembros, obtenerRed } from "../services/red.service"

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
        const data = { "data": redCreada, "mensaje": "Red dada de Alta", "log":`Red(id): ${redCreada.id}` };

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
        const data = {"data":red, mensaje: "Red Eliminada","log":`/ Red(id):${red.id}`}

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

        const data = {"data":datosRed, mensaje: "Red Actualizada","log":`/ Anterior:${estadoAnterior}, Actual:${datosRed}`}
        
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

        const data = {"data":colegiosAActualizar, colegiosANuevos, mensaje: "Miembros Actualizados",
            "log":`/ Colegios actualizados:${colegiosAActualizar}, Colegios Nuevos:${colegiosANuevos} `
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
        const {idRed} = req.query
        const {idColegio} = req.query    
        const miembro = await borrarMiembro(idRed as string,idColegio as string, transaction)
        const data = {"data":miembro, mensaje: "Miembro eliminado", "log":`/ Colegio(id):${miembro.id_colegio}`}

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