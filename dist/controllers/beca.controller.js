"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarDeBajaSolicitud = exports.DesestimarSolicitud = exports.ResolverSolicitud = exports.MiSolicitudDetalle = exports.MisSolicitudesBeca = exports.SolicitudDetalle = exports.SolicitudesBeca = exports.SolicitarBeca = exports.ListadoBecas = exports.AltaBeca = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const beca_service_1 = require("../services/beca.service");
const email_service_1 = require("../services/email.service");
const AltaBeca = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const { idRed } = req.query;
        const becaCreada = await (0, beca_service_1.altaBeca)(req.body, idUsuario, idColegio, idRed, transaction);
        const data = {
            "data": becaCreada,
            "mensaje": `Beca publicada`,
            "log": `/ Cantidad: ${becaCreada.cantidad}`,
            "idColegio": `${idColegio}`
        };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al publicar la Beca', e);
    }
};
exports.AltaBeca = AltaBeca;
const ListadoBecas = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const rol = req.user?.id_rol;
        const { idRed } = req.query;
        const becaCreada = await (0, beca_service_1.listadoBecas)(idRed, idColegio, rol, transaction);
        const data = { "data": becaCreada, "mensaje": "Listado de Becas" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Becas', e);
    }
};
exports.ListadoBecas = ListadoBecas;
const SolicitarBeca = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const { idRed } = req.query;
        const becaSolicitada = await (0, beca_service_1.solicitarBeca)(req.body, idRed, idUsuario, idColegio, transaction);
        const data = { "data": becaSolicitada,
            "mensaje": "Beca Solicitada",
            "log": `/ Cantidad: ${becaSolicitada.cantidad}, Beca (id): ${becaSolicitada.solicitudesCreadas[0].id_beca}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        if (becaSolicitada.emailDestino)
            try {
                await (0, email_service_1.enviarCorreo)(becaSolicitada.emailDestino, "Nueva Solicitud de Beca", `Se ha recibido una nueva solicitud de beca para ${becaSolicitada.cantidad} alumno(s).`, `<h1>Nueva Solicitud de Beca</h1>
                    <p>Se ha recibido una solicitud de beca para ${becaSolicitada.cantidad} alumno(s).</p>
                    <p><b>Colegio Solicitante:</b> ${becaSolicitada.colegioSolicitante}</p>`);
            }
            catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al Solicitar la Beca', e);
    }
};
exports.SolicitarBeca = SolicitarBeca;
const SolicitudesBeca = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const { idRed } = req.query;
        const { idEstado } = req.query;
        const listaSolicitudes = await (0, beca_service_1.listadoSolicitudes)(idRed, idColegio, Number(idEstado), idRol, transaction);
        const data = { "data": listaSolicitudes, "mensaje": "Listado de Solicitudes" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Dolicitudes', e);
    }
};
exports.SolicitudesBeca = SolicitudesBeca;
const SolicitudDetalle = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const { idRed } = req.query;
        const { idSolicitud } = req.query;
        const detalleSolicitud = await (0, beca_service_1.solicitudDetalle)(idSolicitud, idRed, idColegio, idRol, transaction);
        const data = { "data": detalleSolicitud, "mensaje": "Solicitud Encontrada" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener la solicitud', e);
    }
};
exports.SolicitudDetalle = SolicitudDetalle;
const MisSolicitudesBeca = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { idRed } = req.query;
        const idColegio = req.user?.id_colegio;
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const { idEstado } = req.query;
        const listadoMisSolicitudes = await (0, beca_service_1.misSolicitudes)(idRed, idColegio, idRol, idUsuario, Number(idEstado), transaction);
        const data = { "data": listadoMisSolicitudes, "mensaje": "Mis Solicitudes encontradas" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener mis Solicitudes', e);
    }
};
exports.MisSolicitudesBeca = MisSolicitudesBeca;
const MiSolicitudDetalle = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const idUsuario = req.user?.id;
        const { idRed } = req.query;
        const { idSolicitud } = req.query;
        const detalleSolicitud = await (0, beca_service_1.miSolicitudDetalle)(idSolicitud, idRed, idColegio, idRol, idUsuario, transaction);
        const data = { "data": detalleSolicitud, "mensaje": "Solicitud Encontrada" };
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al obtener la solicitud', e);
    }
};
exports.MiSolicitudDetalle = MiSolicitudDetalle;
const ResolverSolicitud = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const { idRed } = req.query;
        const solicitudResuelta = await (0, beca_service_1.resolverSolicitud)(req.body, idRed, idUsuario, idColegio, transaction);
        const data = { "data": solicitudResuelta,
            "mensaje": "Solicitud Resuelta",
            "log": `/ Solicitud (id):${solicitudResuelta.solicitud.id}, Resolucion(id):${solicitudResuelta.solicitud.id_resolucion}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        if (solicitudResuelta.emailDestino)
            try {
                await (0, email_service_1.enviarCorreo)(solicitudResuelta.emailDestino, "Solicitud de Beca Resuelta", `El colegio ${solicitudResuelta.colegioSolicitud} ha resuelto su solicitud.`, `<h1>Solicitud de Beca Resuelta</h1>
                    <p>El colegio ${solicitudResuelta.colegioSolicitud} ha resuelto su solicitud.</p>`);
            }
            catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al resolver la solicitud', e);
    }
};
exports.ResolverSolicitud = ResolverSolicitud;
const DesestimarSolicitud = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const { idRed } = req.query;
        //req.body : id_solicitud, id_resolucion, res_comentario
        const solicitudDesestimada = await (0, beca_service_1.desestimarSolicitud)(req.body, idRed, idUsuario, idColegio, idRol, transaction);
        const data = { "data": solicitudDesestimada,
            "mensaje": "Solicitud Desestimada",
            "log": `/ Solicitud(id):${solicitudDesestimada.solicitud.id}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        if (solicitudDesestimada.emailDestino)
            try {
                await (0, email_service_1.enviarCorreo)(solicitudDesestimada.emailDestino, "Solicitud de Beca Desestimada", `El colegio ${solicitudDesestimada.colegioSolicitante} ha desestimado su solicitud.`, `<h1>Solicitud de Beca Desestimada</h1>
                    <p>El colegio ${solicitudDesestimada.colegioSolicitante} ha desestimado su solicitud.</p>`);
            }
            catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al desestimar la solicitud', e);
    }
};
exports.DesestimarSolicitud = DesestimarSolicitud;
const DarDeBajaSolicitud = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const { idRed } = req.query;
        //req.body : id_solicitud, id_resolucion, res_comentario
        const solicitudDesestimada = await (0, beca_service_1.darBajaSolicitud)(req.body, idRed, idUsuario, idColegio, idRol, transaction);
        const data = { "data": solicitudDesestimada,
            "mensaje": "Beca dada de Baja",
            "log": `/ Solicitud(id):${solicitudDesestimada.solicitud.id}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        if (solicitudDesestimada.emailDestino)
            try {
                await (0, email_service_1.enviarCorreo)(solicitudDesestimada.emailDestino, "Beca dada de baja", `El colegio ${solicitudDesestimada.colegio} ha solicitado la baja de tu beca.`, `<h1>Beca dada de baja</h1>
                    <p>El colegio ${solicitudDesestimada.colegio} ha solicitado la baja de tu beca.</p>`);
            }
            catch (emailError) {
                console.error("⚠️ Error al enviar el correo:", emailError);
                // No lanzamos error aquí para que la solicitud no se vea afectada por problemas en el correo
            }
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de baja la beca', e);
    }
};
exports.DarDeBajaSolicitud = DarDeBajaSolicitud;
