"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrarAutorizado = exports.SuspenderAutorizado = exports.ObtenerAutorizado = exports.EditarAutorizado = exports.AltaAutorizado = exports.ObtenerAutorizados = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const autorizados_service_1 = require("../services/autorizados.service");
const ObtenerAutorizados = async (req, res) => {
    try {
        const id_colegio = req.user?.id_colegio;
        const listado = await (0, autorizados_service_1.listadoAutorizados)(id_colegio);
        const data = { "data": listado, "mensaje": "Listado de AUtorizados obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Autorizados', e);
    }
};
exports.ObtenerAutorizados = ObtenerAutorizados;
const AltaAutorizado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const alta = await (0, autorizados_service_1.altaAutorizado)(idColegio, req.body, transaction);
        const data = { "data": alta,
            "mensaje": "Autorizado dado de alta",
            "log": `/ Autorizado(id):${alta.id}`,
            "idColegio": idColegio };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al dar de alta el Autorizado', e);
    }
};
exports.AltaAutorizado = AltaAutorizado;
const ObtenerAutorizado = async (req, res) => {
    try {
        const { idAutorizado } = req.query;
        const autorizado = await (0, autorizados_service_1.obtenerAutorizado)(idAutorizado);
        const data = { "data": autorizado, "mensaje": "Autorizado Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el autorizado.', e);
    }
};
exports.ObtenerAutorizado = ObtenerAutorizado;
const EditarAutorizado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const idColegio = req.user?.id_colegio;
        const idRol = req.user?.id_rol;
        const usuario = await (0, autorizados_service_1.editarAutorizado)(req.body, idUsuario, idRol, transaction, idColegio);
        const data = { "data": usuario, mensaje: "Datos actualizado", "log": `/ Usuario(id):${usuario.id}`,
            "idColegio": `${idColegio}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al editar el autorizado.', e);
    }
};
exports.EditarAutorizado = EditarAutorizado;
const SuspenderAutorizado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const { idAutorizado } = req.query;
        const Autorizado = await (0, autorizados_service_1.suspenderAutorizado)(idAutorizado, idColegio, transaction);
        const data = {
            "data": Autorizado,
            mensaje: "Autorizado " + (Autorizado.suspendido == 1 ? "Suspendido" : "Activado"),
            "log": `/ Usuario(id):${Autorizado.id}`,
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
exports.SuspenderAutorizado = SuspenderAutorizado;
const BorrarAutorizado = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idColegio = req.user?.id_colegio;
        const { idAutorizado } = req.query;
        const autorizado = await (0, autorizados_service_1.borrarAutorizado)(idAutorizado, idColegio, transaction);
        const data = {
            "data": autorizado,
            mensaje: "Autorizado Eliminado",
            "log": `/ Autorizado(id):${autorizado.id}`,
            "idColegio": `${idColegio}`
        };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar el Autorizado.', e);
    }
};
exports.BorrarAutorizado = BorrarAutorizado;
