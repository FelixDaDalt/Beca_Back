"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = exports.Editar = exports.Borrar = exports.Obtener = exports.ResetarPass = exports.Suspender = exports.ObtenerTyc = exports.AceptarTyc = exports.CambiarPassword = void 0;
const error_handle_1 = require("../utils/error.handle");
const usuario_service_1 = require("../services/usuario.service");
const database_1 = __importDefault(require("../config/database"));
const CambiarPassword = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        const idColegio = req.user?.id_colegio;
        const respuesta = await (0, usuario_service_1.cambiarPassword)(req.body.password, idUsuario, idRol, transaction);
        const data = {
            "data": respuesta,
            "mensaje": "Contraseña Actualizada",
            "log": `/ Usuario(id):${respuesta.datos.id}`,
            "idColegio": `${idColegio}`
        };
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
        const pass = req.body?.password;
        const aceptar = await (0, usuario_service_1.aceptarTyc)(idUsuario, pass, transaction);
        const data = { "data": aceptar,
            "mensaje": "Terminos y Condiciones Aceptados",
            "log": `/ Usuario(id):${aceptar.datos.id}`,
            "idColegio": `${aceptar.datos.id_colegio}` };
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
        const idColegio = req.user?.id_colegio;
        const { user, admin } = req.query;
        const alta = await (0, usuario_service_1.resetarPass)(idRol, transaction, user, admin);
        const data = {
            "data": alta,
            "mensaje": "Contraseña restablecida",
            "log": `/ ${user ? 'Usuario(id)' : admin ? 'Administrador(id)' : ''}+${alta.id}`,
            "idColegio": `${idColegio}`
        };
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
        const idColegio = req.user?.id_colegio;
        const { id } = req.query;
        const usuario = await (0, usuario_service_1.suspender)(idRol, id, transaction);
        const data = {
            "data": usuario,
            mensaje: "Usuario " + (usuario.suspendido == 1 ? "Suspendido" : "Activado"),
            "log": `/ Usuario(id):${usuario.id}`,
            "idColegio": `${idColegio}`
        };
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
        const idColegio = req.user?.id_colegio;
        const { id } = req.query;
        const usuario = await (0, usuario_service_1.borrar)(idRol, id, transaction);
        const data = {
            "data": usuario,
            mensaje: "Usuario Eliminado",
            "log": `/ Usuario(id):${usuario.id}`,
            "idColegio": `${idColegio}`
        };
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
        const data = { "data": usuario, mensaje: "Datos actualizado", "log": `/ Usuario(id):${usuario.id}`,
            "idColegio": `${idColegio}` };
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
