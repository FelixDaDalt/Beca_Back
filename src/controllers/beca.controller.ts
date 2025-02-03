import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';
import { altaBeca, darBajaSolicitud, desestimarSolicitud, listadoBecas, listadoSolicitudes, miSolicitudDetalle, misSolicitudes, resolverSolicitud, solicitarBeca, solicitudDetalle } from "../services/beca.service"


const AltaBeca = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 

        const becaCreada = await altaBeca(req.body, idUsuario,idColegio,idRed as string,transaction);
        const data = { "data": becaCreada , "mensaje": "Beca publicada" };

        await transaction.commit();
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al dar de alta la Red', e);    
    }
};

const ListadoBecas = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 

        const becaCreada = await listadoBecas(idRed as string,idColegio,transaction);
        const data = { "data": becaCreada , "mensaje": "Listado de Becas" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al obtener el listado de Becas', e);    
    }
};

const SolicitarBeca = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 
        
        const becaSolicitada = await solicitarBeca(req.body,idRed as string, idUsuario,idColegio,transaction);
        const data = { "data": becaSolicitada , "mensaje": "Beca Solicitada" };

        await transaction.commit();
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al Solicitar la Beca', e);    
    }
};

const SolicitudesBeca = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query
        const {idEstado} = req.query 

        const listaSolicitudes = await listadoSolicitudes(idRed as string,idColegio, idEstado as string,transaction);
        const data = { "data": listaSolicitudes , "mensaje": "Listado de Solicitudes" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al obtener el listado de Dolicitudes', e);    
    }
};

const SolicitudDetalle = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query
        const {idSolicitud} = req.query
         

        const detalleSolicitud = await solicitudDetalle(idSolicitud as string,idRed as string,idColegio, transaction);
        const data = { "data": detalleSolicitud , "mensaje": "Solicitud Encontrada" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al obtener la solicitud', e);    
    }
};

const MisSolicitudesBeca = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 
        const {idRed} = req.query
        const idColegio = req.user?.id_colegio;
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const {idEstado} = req.query      

        const listadoMisSolicitudes = await misSolicitudes(idRed as string,idColegio,idRol, idUsuario, idEstado as string, transaction);
        const data = { "data": listadoMisSolicitudes , "mensaje": "Mis Solicitudes encontradas" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al obtener mis Solicitudes', e);    
    }
};

const MiSolicitudDetalle = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try {
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const idUsuario = req.user?.id;
        const {idRed} = req.query
        const {idSolicitud} = req.query
         

        const detalleSolicitud = await miSolicitudDetalle(idSolicitud as string,idRed as string,idColegio,idRol,idUsuario, transaction);
        const data = { "data": detalleSolicitud , "mensaje": "Solicitud Encontrada" };

        await transaction.commit();
        
        // 6. Enviar la respuesta
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al obtener la solicitud', e);    
    }
};

const ResolverSolicitud = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const {idRed} = req.query 
        //req.body : id_solicitud, id_resolucion, res_comentario

        
        
        const solicitudResuelta = await resolverSolicitud(req.body,idRed as string, idUsuario,idColegio,transaction);
        const data = { "data": solicitudResuelta , "mensaje": "Solicitud Resuelta" };

        await transaction.commit();
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al resolver la solicitud', e);    
    }
};

const DesestimarSolicitud = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const {idRed} = req.query 
        //req.body : id_solicitud, id_resolucion, res_comentario

        
        
        const solicitudDesestimada = await desestimarSolicitud(req.body,idRed as string, idUsuario,idColegio,idRol,transaction);
        const data = { "data": solicitudDesestimada , "mensaje": "Solicitud Desestimada" };

        await transaction.commit();
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al desestimar la solicitud', e);    
    }
};

const DarDeBajaSolicitud = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const {idRed} = req.query 
        //req.body : id_solicitud, id_resolucion, res_comentario

        
        
        const solicitudDesestimada = await darBajaSolicitud(req.body,idRed as string, idUsuario,idColegio,idRol,transaction);
        const data = { "data": solicitudDesestimada , "mensaje": "Solicitud dada de Baja" };

        await transaction.commit();
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al desestimar la solicitud', e);    
    }
};
export {AltaBeca, ListadoBecas,SolicitarBeca,SolicitudesBeca,SolicitudDetalle,MisSolicitudesBeca,MiSolicitudDetalle,ResolverSolicitud,DesestimarSolicitud,DarDeBajaSolicitud}