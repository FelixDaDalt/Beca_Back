"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = exports.ObtenerMiembros = exports.EditarMiembrosRed = exports.BorrarMiembro = exports.ColegiosDisponibles = exports.ObtenerRed = exports.EditarDatosRed = exports.BorrarRed = exports.ObtenerRedes = exports.AltaRed = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const red_service_1 = require("../services/red.service");
const registro_service_1 = require("../services/registro.service");
const request_ip_1 = __importDefault(require("request-ip"));
const ObtenerRed = async (req, res) => {
    try {
        const { idRed } = req.query;
        const listado = await (0, red_service_1.obtenerRed)(idRed);
        const data = { "data": listado, "mensaje": "Red Encontrada" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtenerla Red', e);
    }
};
exports.ObtenerRed = ObtenerRed;
const AltaRed = async (req, res) => {
    const transaction = await database_1.default.transaction();
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
        const redCreada = await (0, red_service_1.altaRed)(redConFoto, transaction);
        const data = { "data": redCreada, "mensaje": "Red dada de Alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 3, redCreada.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction);
        const registrosColegios = colegios.map((colegio) => {
            // Definir la descripción según si es anfitrión o no
            const descripcion = colegio.anfitrion === 1
                ? `Colegio asignado como Anfitrión en la red ${redCreada.nombre}, ID:${redCreada.id}`
                : `Colegio vinculado como Miembro en la red ${redCreada.nombre}, ID:${redCreada.id}`;
            return (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, colegio.id, colegio.anfitrion === 1 ? "Anfitrion" : 'Miembro', descripcion, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, colegio.id);
        });
        await Promise.all(registrosColegios);
        await transaction.commit();
        // 6. Enviar la respuesta
        res.status(200).send(data);
    }
    catch (e) {
        // En caso de error, hacer rollback
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta la Red', e);
    }
};
exports.AltaRed = AltaRed;
const ObtenerRedes = async (req, res) => {
    try {
        let idColegio = undefined;
        const idRol = req.user?.id_rol;
        if (idRol > 0) {
            idColegio = req.user?.id_colegio;
        }
        const listado = await (0, red_service_1.listadoRedes)(idColegio);
        const data = { "data": listado, "mensaje": "Listado de Redes obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Redes', e);
    }
};
exports.ObtenerRedes = ObtenerRedes;
const BorrarRed = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        const { idRed } = req.query;
        const red = await (0, red_service_1.borrarRed)(idRed, transaction);
        const data = { "data": red, mensaje: "Red Eliminada" };
        const idRol = req.user?.id_rol;
        const idUsuario = req.user?.id;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 3, red.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar la Red.', e);
    }
};
exports.BorrarRed = BorrarRed;
const EditarDatosRed = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/redes/${file.filename}` : body.foto;
        const redConFoto = {
            red: {
                ...body.red,
                foto: fotoUrl,
            },
        };
        const { datosRed, estadoAnterior } = await (0, red_service_1.editarDatosRed)(redConFoto.red, idRol, idColegio, transaction);
        const data = { "data": datosRed, mensaje: "Red Actualizada" };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 3, datosRed.id, "Editar", `Red editada ${datosRed.nombre}. ${JSON.stringify(estadoAnterior)}`, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (error) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al editar la Red', error);
    }
};
exports.EditarDatosRed = EditarDatosRed;
const EditarMiembrosRed = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const { red, colegiosAActualizar, colegiosANuevos } = await (0, red_service_1.editarMiembrosRed)(req.body, idRol, idColegio, transaction);
        const data = { "data": colegiosAActualizar, colegiosANuevos, mensaje: "Miembros Actualizados" };
        if (colegiosAActualizar.length > 0) {
            for (const colegio of colegiosAActualizar) {
                await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, colegio, "Miembro", `Colegio vinculado como Miembro en la red ${red.nombre}`, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, idColegio);
            }
        }
        if (colegiosANuevos.length > 0) {
            for (const colegio of colegiosANuevos) {
                await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, colegio.id_colegio, "Miembro", `Colegio vinculado como Miembro en la red ${red.nombre}`, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, idColegio);
            }
        }
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (error) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al editar la Red', error);
    }
};
exports.EditarMiembrosRed = EditarMiembrosRed;
const ColegiosDisponibles = async (req, res) => {
    try {
        const { idRed } = req.query;
        const listado = await (0, red_service_1.colegiosDisponibles)(idRed);
        const data = { "data": listado, "mensaje": "Red Encontrada" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtenerla Red', e);
    }
};
exports.ColegiosDisponibles = ColegiosDisponibles;
const BorrarMiembro = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        const { idRed } = req.query;
        const { idColegio } = req.query;
        const miembro = await (0, red_service_1.borrarMiembro)(idRed, idColegio, transaction);
        const data = { "data": miembro, mensaje: "Miembro eliminado" };
        const idRol = req.user?.id_rol;
        const idUsuario = req.user?.id;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, miembro.id_colegio, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        //IMPLEMENTAR DESVINCULACION DE LOS COLEGIOS
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar la Red.', e);
    }
};
exports.BorrarMiembro = BorrarMiembro;
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
/// MIEMBROS
const Me = async (req, res) => {
    try {
        const { idRed } = req.query;
        const idColegio = req.user?.id_colegio;
        const me = await (0, red_service_1.meRed)(idRed, idColegio);
        const data = { "data": me, "mensaje": "Datos red Encontrados" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener los datos en la red.', e);
    }
};
exports.Me = Me;
const ObtenerMiembros = async (req, res) => {
    try {
        const { idRed } = req.query;
        const listado = await (0, red_service_1.obtenerMiembros)(idRed);
        const data = { "data": listado, "mensaje": "Miembros encontrados" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtenerla los miembros', e);
    }
};
exports.ObtenerMiembros = ObtenerMiembros;
