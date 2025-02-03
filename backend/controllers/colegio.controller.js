"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarColegio = exports.BorrarColegio = exports.DetalleColegio = exports.ObtenerColegios = exports.SuspenderColegio = exports.AltaColegio = exports.ObtenerColegio = void 0;
const error_handle_1 = require("../utils/error.handle");
const colegio_service_1 = require("../services/colegio.service");
const database_1 = __importDefault(require("../config/database"));
const registro_service_1 = require("../services/registro.service");
const request_ip_1 = __importDefault(require("request-ip"));
const ObtenerColegio = async (req, res) => {
    try {
        const idColegio = req.user?.id_colegio;
        const listado = await (0, colegio_service_1.obtenerColegio)(idColegio);
        const data = { "data": listado, "mensaje": "Colegio Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el colegio', e);
    }
};
exports.ObtenerColegio = ObtenerColegio;
const AltaColegio = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/colegio/${file.filename}` : body.foto;
        const colegioConFoto = {
            colegio: {
                ...body.colegio,
                foto: fotoUrl,
            },
            usuario: {
                ...body.usuario
            }
        };
        const alta = await (0, colegio_service_1.altaColegio)(colegioConFoto, transaction);
        const data = { "data": alta, "mensaje": "Colegio dado de Alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        // Registrar evento para el alta del colegio
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, alta.colegio.responseColegio.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, alta.colegio.responseColegio.id);
        const responsableRegistro = `Responsable dado de alta`;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 1, // Puedes cambiar el ID de la entidad tipo si es necesario
        alta.responsable.responseUsuario.id, // El ID del administrador (responsable)
        "Alta", // La acción realizada
        responsableRegistro, // Descripción de la acción
        request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, alta.colegio.responseColegio.id);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el colegio', e);
    }
};
exports.AltaColegio = AltaColegio;
const EditarColegio = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/colegio/${file.filename}` : body.foto;
        const colegioConFoto = {
            ...body.colegio,
            foto: fotoUrl,
        };
        console.log(colegioConFoto);
        const alta = await (0, colegio_service_1.editarColegio)(colegioConFoto, transaction);
        const data = { "data": alta.editar, "mensaje": "Colegio Actualizado" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        // // Registrar evento para el alta del colegio
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     2, 
        //     alta.colegio.responseColegio.id, 
        //     "Alta",  
        //     data.mensaje, 
        //     requestIp.getClientIp(req) || '',
        //     req.headers['user-agent'] || '',
        //     transaction,
        //     alta.colegio.responseColegio.id
        // );
        // const responsableRegistro = `Responsable dado de alta`;
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     1, // Puedes cambiar el ID de la entidad tipo si es necesario
        //     alta.responsable.responseUsuario.id,  // El ID del administrador (responsable)
        //     "Alta",  // La acción realizada
        //     responsableRegistro,  // Descripción de la acción
        //     requestIp.getClientIp(req) || '',
        //     req.headers['user-agent'] || '',
        //     transaction,
        //     alta.colegio.responseColegio.id
        // );
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el colegio', e);
    }
};
exports.EditarColegio = EditarColegio;
const ObtenerColegios = async (req, res) => {
    try {
        const listado = await (0, colegio_service_1.listadoColegios)();
        const data = { "data": listado, "mensaje": "Listado de colegios obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de colegios', e);
    }
};
exports.ObtenerColegios = ObtenerColegios;
const SuspenderColegio = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { idColegio } = req.query;
        const colegio = await (0, colegio_service_1.suspenderColegio)(idColegio, transaction);
        const data = {
            "data": colegio,
            mensaje: "Colegio " + (colegio.suspendido == 1 ? "Suspendido" : "Activado")
        };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, colegio.id, colegio.suspendido == 1 ? "Suspender" : "Activar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, colegio.id);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al suspender el colegio', e);
    }
};
exports.SuspenderColegio = SuspenderColegio;
const DetalleColegio = async (req, res) => {
    try {
        const idRol = req.user?.id_rol;
        let idColegio = req.query.id;
        if (idRol > 0) {
            idColegio = req.user?.id_colegio;
        }
        const detalle = await (0, colegio_service_1.detalleColegio)(idColegio);
        const data = { "data": detalle, "mensaje": "Detalle del colegio" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el Detalle del colegio', e);
    }
};
exports.DetalleColegio = DetalleColegio;
const BorrarColegio = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { idColegio } = req.query;
        const colegio = await (0, colegio_service_1.borrarColegio)(idColegio, transaction);
        const data = {
            "data": colegio,
            mensaje: "Colegio Eliminado"
        };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 2, colegio.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, colegio.id);
        const descripcion = `Usuario eliminado por: ${data.mensaje}, (ID: ${colegio.id})`;
        const registrosUsuarios = colegio.usuarios.map((usuario) => {
            return (0, registro_service_1.registrarEvento)(idUsuario, idRol, 1, usuario.id, 'Borrar', descripcion, request_ip_1.default.getClientIp(req) || '', req.headers['user-agent'] || '', transaction, colegio.id);
        });
        await Promise.all(registrosUsuarios);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al suspender el colegio', e);
    }
};
exports.BorrarColegio = BorrarColegio;
