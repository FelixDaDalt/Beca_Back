import { Request, Response } from "express"
import { handleHttp } from "../utils/error.handle"
import { RequestExt } from "../middleware/session"
import sequelize from "../config/database"
import { registrarEvento } from "../services/registro.service"
import requestIp from 'request-ip';
import { altaBeca, darBajaSolicitud, desestimarSolicitud, listadoBecas, listadoSolicitudes, miSolicitudDetalle, misSolicitudes, resolverSolicitud, solicitarBeca, solicitudDetalle } from "../services/beca.service"
import { enviarCorreo } from "../services/email.service"


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
        handleHttp(res, 'Error al dar de alta la Beca', e);    
    }
};

const ListadoBecas = async (req: RequestExt, res: Response) => {
    const transaction = await sequelize.transaction(); 
    try { 

        const idColegio = req.user?.id_colegio;
        const rol = req.user?.id_rol;
        const {idRed} = req.query 


        const becaCreada = await listadoBecas(idRed as string,idColegio,rol as number,transaction);
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

        if(becaSolicitada.emailDestino)
            try {
                await enviarCorreo(
                    becaSolicitada.emailDestino,
                    "Nueva Solicitud de Beca",
                    `Se ha recibido una nueva solicitud de beca para ${becaSolicitada.cantidad} alumno(s).`,
                    `<h1>Nueva Solicitud de Beca</h1>
                    <p>Se ha recibido una solicitud de beca para ${becaSolicitada.cantidad} alumno(s).</p>
                    <p><b>Colegio Solicitante:</b> ${becaSolicitada.colegioSolicitante}</p>`
                );
            } catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        
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
        const idRol = req.user?.id_rol;
        const {idRed} = req.query
        const {idEstado} = req.query 

        const listaSolicitudes = await listadoSolicitudes(idRed as string,idColegio, Number(idEstado), idRol,transaction);
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
        const idRol = req.user?.id_rol;
        const {idRed} = req.query
        const {idSolicitud} = req.query
         

        const detalleSolicitud = await solicitudDetalle(idSolicitud as string,idRed as string,idColegio, idRol, transaction);
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

        const listadoMisSolicitudes = await misSolicitudes(idRed as string,idColegio,idRol, idUsuario, Number(idEstado), transaction);
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
        
        const solicitudResuelta = await resolverSolicitud(req.body,idRed as string, idUsuario,idColegio,transaction);
        const data = { "data": solicitudResuelta , "mensaje": "Solicitud Resuelta" };

        await transaction.commit();

        if(solicitudResuelta.emailDestino)
            try {
                await enviarCorreo(
                    solicitudResuelta.emailDestino,
                    "Solicitud de Beca Resuelta",
                    `El colegio ${solicitudResuelta.colegioSolicitud} ha resuelto tu solicitud.`,
                    `<h1>Solicitud de Beca Resuelta</h1>
                    <p>El colegio ${solicitudResuelta.colegioSolicitud} ha resuelto tu solicitud.</p>`
                );
            } catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        
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
        
        if(solicitudDesestimada.emailDestino)
            try {
                await enviarCorreo(
                    solicitudDesestimada.emailDestino,
                    "Solicitud de Beca Desestimada",
                    `El colegio ${solicitudDesestimada.colegioSolicitante} ha desestimado su solicitud.`,
                    `<h1>Solicitud de Beca Desestimada</h1>
                    <p>El colegio ${solicitudDesestimada.colegioSolicitante} ha resuelto tu solicitud.</p>`
                );
            } catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }


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

        if(solicitudDesestimada.emailDestino)
            try {
                await enviarCorreo(
                    solicitudDesestimada.emailDestino,
                    "Beca dada de baja",
                    `El colegio ${solicitudDesestimada.colegio} ha solicitado la baja de tu beca.`,
                    `<h1>Beca dada de baja</h1>
                    <p>El colegio ${solicitudDesestimada.colegio} ha solicitado la baja de tu beca.</p>`
                );
            } catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        
        res.status(200).send(data);
    } catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        handleHttp(res, 'Error al dar de baja la beca', e);    
    }
};

export {AltaBeca, ListadoBecas,SolicitarBeca,SolicitudesBeca,SolicitudDetalle,MisSolicitudesBeca,MiSolicitudDetalle,ResolverSolicitud,DesestimarSolicitud,DarDeBajaSolicitud}