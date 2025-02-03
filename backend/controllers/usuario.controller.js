"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = exports.Editar = exports.Borrar = exports.Obtener = exports.ResetarPass = exports.Suspender = exports.ObtenerTyc = exports.AceptarTyc = exports.CambiarPassword = void 0;
const error_handle_1 = require("../utils/error.handle");
const usuario_service_1 = require("../services/usuario.service");
const database_1 = __importDefault(require("../config/database"));
const registro_service_1 = require("../services/registro.service");
const request_ip_1 = __importDefault(require("request-ip"));
const CambiarPassword = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const respuesta = await (0, usuario_service_1.cambiarPassword)(req.body.password, idUsuario, idRol, transaction);
        const data = { "data": respuesta, "mensaje": "Contraseña Actualizada" };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, idRol == 0 ? 0 : 1, idUsuario, "Password", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar la contraseña', e);
    }
};
exports.CambiarPassword = CambiarPassword;
const AceptarTyc = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const pass = req.body?.password;
        const aceptar = await (0, usuario_service_1.aceptarTyc)(idUsuario, pass, transaction);
        const data = { "data": aceptar, "mensaje": "Terminos y Condiciones Aceptados" };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 1, idUsuario, "Aceptar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al aceptar los Terminos y Condiciones.', e);
    }
};
exports.AceptarTyc = AceptarTyc;
const ObtenerTyc = async (req, res) => {
    try {
        const tyc = await (0, usuario_service_1.obtenerTyc)();
        const data = { "data": tyc, "mensaje": "Terminos y Condiciones" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener los Terminos y Condiciones.', e);
    }
};
exports.ObtenerTyc = ObtenerTyc;
const Obtener = async (req, res) => {
    try {
        const { idUsuario } = req.query;
        const usuario = await (0, usuario_service_1.obtenerUsuario)(idUsuario);
        const data = { "data": usuario, "mensaje": "Usuario Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el usuario.', e);
    }
};
exports.Obtener = Obtener;
const ResetarPass = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idRol = req.user?.id_rol;
        const { user, admin } = req.query;
        const alta = await (0, usuario_service_1.resetarPass)(idRol, transaction, user, admin);
        const idColegio = req.user?.id_colegio;
        const idUsuario = req.user?.id;
        const data = { "data": alta, "mensaje": "Contraseña restablecida" };
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, idRol == 0 ? 0 : 1, alta.id, "Reiniciar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al restablecer la contraseña', e);
    }
};
exports.ResetarPass = ResetarPass;
const Suspender = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idRol = req.user?.id_rol;
        const { id } = req.query;
        const usuario = await (0, usuario_service_1.suspender)(idRol, id, transaction);
        const data = {
            "data": usuario,
            mensaje: "Usuario " + (usuario.suspendido == 1 ? "Suspendido" : "Activado")
        };
        const idColegio = req.user?.id_colegio;
        const idUsuario = req.user?.id;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, idRol == 0 ? 0 : 1, usuario.id, usuario.suspendido == 1 ? "Suspender" : "Activar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al suspender el usuario.', e);
    }
};
exports.Suspender = Suspender;
const Borrar = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idRol = req.user?.id_rol;
        const { id } = req.query;
        const usuario = await (0, usuario_service_1.borrar)(idRol, id, transaction);
        const data = {
            "data": usuario,
            mensaje: "Usuario Eliminado"
        };
        const idColegio = req.user?.id_colegio;
        const idUsuario = req.user?.id;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, idRol == 0 ? 0 : 1, usuario.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction, idColegio);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar el usuario.', e);
    }
};
exports.Borrar = Borrar;
const Editar = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const { body, file } = req;
        const fotoUrl = file ? `/uploads/avatar/${file.filename}` : body.foto;
        const userConFoto = {
            usuario: {
                ...body.usuario,
                foto: fotoUrl,
            },
        };
        const usuario = await (0, usuario_service_1.editar)(userConFoto.usuario, idUsuario, idRol, transaction, idColegio);
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
        (0, error_handle_1.handleHttp)(res, 'Error al editar el usuario.', e);
    }
};
exports.Editar = Editar;
const Me = async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        const usuario = await (0, usuario_service_1.me)(idUsuario);
        const data = { "data": usuario, "mensaje": "Usuario Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el usuario.', e);
    }
};
exports.Me = Me;
