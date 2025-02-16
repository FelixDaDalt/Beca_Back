"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = exports.ObtenerMiembros = exports.EditarMiembrosRed = exports.BorrarMiembro = exports.ColegiosDisponibles = exports.ObtenerRed = exports.EditarDatosRed = exports.BorrarRed = exports.ObtenerRedes = exports.AltaRed = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const red_service_1 = require("../services/red.service");
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
        const data = { "data": redCreada, "mensaje": "Red dada de Alta", "log": `Red(id): ${redCreada.id}` };
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
        const data = { "data": red, mensaje: "Red Eliminada", "log": `/ Red(id):${red.id}` };
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
        const data = { "data": datosRed, mensaje: "Red Actualizada", "log": `/ Anterior:${estadoAnterior}, Actual:${datosRed}` };
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
        const data = { "data": colegiosAActualizar, colegiosANuevos, mensaje: "Miembros Actualizados",
            "log": `/ Colegios actualizados:${colegiosAActualizar}, Colegios Nuevos:${colegiosANuevos} `
        };
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
        const { idRed } = req.query;
        const { idColegio } = req.query;
        const miembro = await (0, red_service_1.borrarMiembro)(idRed, idColegio, transaction);
        const data = { "data": miembro, mensaje: "Miembro eliminado", "log": `/ Colegio(id):${miembro.id_colegio}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar la Red.', e);
    }
};
exports.BorrarMiembro = BorrarMiembro;
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
        const rol = req.user?.id_rol;
        const listado = await (0, red_service_1.obtenerMiembros)(idRed, rol);
        const data = { "data": listado, "mensaje": "Miembros encontrados" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtenerla los miembros', e);
    }
};
exports.ObtenerMiembros = ObtenerMiembros;
