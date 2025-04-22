"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actualizar = exports.Me = exports.BorrarAdministrador = exports.ObtenerAdministrador = exports.SuspenderAdministrador = exports.ObtenerAdministradores = exports.Comprobar = exports.AltaAdministrador = exports.NuevoTyc = exports.ListadoTyc = void 0;
const error_handle_1 = require("../utils/error.handle");
const admin_service_1 = require("../services/admin.service");
const database_1 = __importDefault(require("../config/database"));
//ADMINISTRADORES
const AltaAdministrador = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const alta = await (0, admin_service_1.altaAdministrador)(req.body, transaction);
        const data = { "data": alta, "mensaje": "Administrador dado de alta", "log": `/ Administrador(id):${alta.id}` };
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
        const idRol = req.user?.id_rol;
        const { idAdmin } = req.query;
        const adminSuspendido = await (0, admin_service_1.suspenderAdministrador)(idRol, idAdmin, transaction);
        const data = {
            "data": adminSuspendido,
            mensaje: "Administrador " + (adminSuspendido.suspendido == 1 ? "Suspendido " : "Activado "),
            "log": `/ Administrador(id):${adminSuspendido.id}`
        };
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
        const idRol = req.user?.id_rol;
        const { idAdmin } = req.query;
        const adminBorrado = await (0, admin_service_1.borrarAdministrador)(idRol, idAdmin, transaction);
        const data = {
            "data": adminBorrado,
            mensaje: "Administrador Eliminado",
            "log": `/ Administrador(id):${adminBorrado.id}`
        };
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
        const data = { "data": usuario, mensaje: "Datos actualizado", "log": `/ Administrador(id):${usuario.id}` };
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
        const id_colegio = req.user?.id_colegio;
        const { cuit, dni, dniAdmin, dniAutorizado } = req.query;
        const comprobacion = await (0, admin_service_1.comprobarDisponibilidad)(cuit, dni, dniAdmin, dniAutorizado, id_colegio);
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
        const altaTyc = await (0, admin_service_1.nuevoTyc)(req.body, transaction);
        const data = {
            "data": altaTyc,
            "mensaje": "Nuevos Terminos y Condiciones creado",
            "log": `/ Tyc(id):${altaTyc.id}`,
        };
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
