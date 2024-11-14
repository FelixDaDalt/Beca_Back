import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { registrarActividad, registrarActividadColegio, registrarActividadRed } from "../services/registro.service"
import { altaRed, borrarRed, listadoRedes } from "../services/red.service"


// const ObtenerColegio = async (req:RequestExt,res:Response)=>{
//     try{ 
//         const idColegio = req.user?.id_colegio 
//         const listado = await obtenerColegio(idColegio)
//         const data = {"data":listado,"mensaje":"Colegio Encontrado"}
//         res.status(200).send(data);
//     }catch(e){
//         handleHttp(res,'Error al obtener el colegio',e)    
//     }
// }

const AltaRed = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        // 1. Crear la red
        const redCreada = await altaRed(req.body, transaction);
        const data = { "data": redCreada, "mensaje": "Red dada de Alta" };

        const idusuario = req.user?.id;
        const idrol = req.user?.id_rol;

        // 2. Registrar la actividad para la red
        await registrarActividadRed(redCreada.id, idusuario, idrol, data.mensaje, transaction);

        // 3. Crear los registros de actividad para los colegios
        const registrosColegios = req.body.colegios.map((colegio: { id: number, anfitrion: number }) => {
            // Definir la descripción según si es anfitrión o no
            const descripcion = colegio.anfitrion === 1 
                ? `Colegio asignado como Anfitrion en la red ${redCreada.nombre}, ID:${redCreada.id}`  // Nombre de la red
                : `Colegio añadido a la red ${redCreada.nombre}, ID:${redCreada.id}`;  // Si no es anfitrión, descripción estándar
        
            return registrarActividadColegio(
                colegio.id, 
                idusuario, 
                idrol, 
                descripcion, 
                transaction
            );
        });

        // 4. Ejecutar todas las promesas de forma paralela
        await Promise.all(registrosColegios);

        // 5. Confirmar la transacción
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
        const listado = await listadoRedes()
        const data = {"data":listado,"mensaje":"Listado de Redes obtenidos"}
        res.status(200).send(data);
    }catch(e){
        handleHttp(res,'Error al obtener el listado de Redes',e)    
    }
}

const BorrarRed = async (req:RequestExt,res:Response)=>{
    const transaction = await sequelize.transaction()
    try{
        const id_rol = req.user?.id_rol
        const {idRed} = req.query   
        const red = await borrarRed(idRed as string,transaction)
        const data = {
            "data":red,
            mensaje: "Red Eliminada"
        }

        const id_usuario = req.user?.id 
        await registrarActividadRed(red.id,id_usuario,id_rol,data.mensaje,transaction)
       
        const descripcionRegistro = `Elimino la Red:  ${red.nombre} (ID: ${red.id})`;
        await registrarActividad(id_usuario, id_rol, descripcionRegistro, transaction);
       
        await transaction.commit()

        res.status(200).send(data)       
    }catch(e){
        await transaction.rollback()
        handleHttp(res,'Error al eliminar la Red.',e)    
    }
}

// const SuspenderColegio = async (req:RequestExt,res:Response)=>{
//     const transaction = await sequelize.transaction();
//     try{ 
//         const { idColegio } = req.query; 
//         const colegio = await suspenderColegio(idColegio as string,transaction)
//         const data = {
//             "data":colegio,
//             mensaje: "Colegio " + (colegio.suspendido == 1 ? "Suspension " : "Activacion ") + colegio.nombre
//         }

//         const idAdmin = req.user?.id 
//         const idRol = req.user?.id_rol
        
//         const descripcionRegistro = `${(colegio.suspendido == 1 ? "Suspension " : "Activacion ")} de colegio:  ${colegio.cuit} (${colegio.id})`;
//         await registrarActividad(idAdmin,idRol, descripcionRegistro, transaction);
        
//         await transaction.commit()
//         res.status(200).send(data);
//     }catch(e){
//         await transaction.rollback()
//         handleHttp(res,'Error al suspender el colegio',e)    
//     }
// }

// const DetalleColegio = async (req:RequestExt,res:Response)=>{
//     try{ 
//         const idRol = req.user?.id_rol;
//         let idColegio = req.query.id
//         if (idRol > 0) {
//             idColegio = req.user?.id_colegio
//         }

//         const detalle = await detalleColegio(idColegio as string)
//         const data = {"data":detalle,"mensaje":"Detalle del colegio"}
//         res.status(200).send(data);
//     }catch(e){
//         handleHttp(res,'Error al obtener el Detalle del colegio',e)    
//     }
// }

export {AltaRed,ObtenerRedes,BorrarRed}