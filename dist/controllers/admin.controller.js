"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actualizar = exports.Me = exports.BorrarAdministrador = exports.ObtenerAdministrador = exports.SuspenderAdministrador = exports.ObtenerAdministradores = exports.Comprobar = exports.AltaAdministrador = exports.NuevoTyc = exports.ListadoTyc = void 0;
const error_handle_1 = require("../utils/error.handle");
const admin_service_1 = require("../services/admin.service");
const database_1 = __importDefault(require("../config/database"));
const registro_service_1 = require("../services/registro.service");
const request_ip_1 = __importDefault(require("request-ip"));
//ADMINISTRADORES
const AltaAdministrador = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const alta = await (0, admin_service_1.altaAdministrador)(req.body, transaction);
        const data = { "data": alta, "mensaje": "Administrador dado de alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 0, alta.id, 'Alta', data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el administrador', e);
    }
};
exports.AltaAdministrador = AltaAdministrador;
const ObtenerAdministradores = async (req, res) => {
    try {
        const idConsulta = req.user?.id;
        const listado = await (0, admin_service_1.listadoAdministradores)(idConsulta);
        const data = { "data": listado, "mensaje": "Listado de administradores obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de administradores', e);
    }
};
exports.ObtenerAdministradores = ObtenerAdministradores;
const SuspenderAdministrador = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const { idAdmin } = req.query;
        const adminSuspendido = await (0, admin_service_1.suspenderAdministrador)(idRol, idAdmin, transaction);
        const data = {
            "data": adminSuspendido,
            mensaje: "Administrador " + (adminSuspendido.suspendido == 1 ? "Suspendido " : "Activado ")
        };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 0, adminSuspendido.id, adminSuspendido.suspendido == 1 ? "Suspender" : "Activar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al suspender el Administrador.', e);
    }
};
exports.SuspenderAdministrador = SuspenderAdministrador;
const BorrarAdministrador = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const { idAdmin } = req.query;
        const adminBorrado = await (0, admin_service_1.borrarAdministrador)(idRol, idAdmin, transaction);
        const data = {
            "data": adminBorrado,
            mensaje: "Administrador Eliminado"
        };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 0, adminBorrado.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar el Administrador.', e);
    }
};
exports.BorrarAdministrador = BorrarAdministrador;
const ObtenerAdministrador = async (req, res) => {
    try {
        const { idAdmin } = req.query;
        const administrador = await (0, admin_service_1.obtenerAdministrador)(idAdmin);
        const data = { "data": administrador, "mensaje": "Administrador Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el Administrador.', e);
    }
};
exports.ObtenerAdministrador = ObtenerAdministrador;
const Actualizar = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/avatar/${file.filename}` : body.foto;
        const userConFoto = {
            usuario: {
                ...body.usuario,
                foto: fotoUrl,
            },
        };
        const usuario = await (0, admin_service_1.actualizar)(userConFoto.usuario, idUsuario, transaction);
        const data = { "data": usuario, mensaje: "Datos actualizado" };
        // const idColegio = req.user?.id_colegio
        // const idUsuario = req.user?.id 
        // await registrarEvento(
        //     idUsuario,
        //     idRol,
        //     idRol==0?0:1,
        //     usuario.id,
        //     usuario.suspendido == 1?"Suspender":"Activar",
        //     data.mensaje,
        //     requestIp.getClientIp(req) || 'No Disponible',
        //     req.headers['user-agent'] || 'No Disponible',
        //     transaction,
        //     idColegio
        // );
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al suspender el usuario.', e);
    }
};
exports.Actualizar = Actualizar;
const Me = async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        const usuario = await (0, admin_service_1.me)(idUsuario);
        const data = { "data": usuario, "mensaje": "Usuario Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el usuario.', e);
    }
};
exports.Me = Me;
//OTROS
const Comprobar = async (req, res) => {
    try {
        const { cuit, dni, url, dniAdmin } = req.query;
        const comprobacion = await (0, admin_service_1.comprobarDisponibilidad)(cuit, dni, url, dniAdmin);
        res.status(200).send(comprobacion);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al comprobar', e);
    }
};
exports.Comprobar = Comprobar;
const NuevoTyc = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const altaTyc = await (0, admin_service_1.nuevoTyc)(req.body, transaction);
        const data = { "data": altaTyc, "mensaje": "Nuevos Terminos y Condiciones creado" };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 6, altaTyc.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al guardar los nuevos Terminos y Condiciones', e);
    }
};
exports.NuevoTyc = NuevoTyc;
const ListadoTyc = async (req, res) => {
    try {
        const listado = await (0, admin_service_1.listadoTyc)();
        const data = { "data": listado, "mensaje": "Listado de Terminos y Condiciones" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener listado de Terminos y Condiciones', e);
    }
};
exports.ListadoTyc = ListadoTyc;
