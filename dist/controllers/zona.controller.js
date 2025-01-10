"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarZona = exports.ActualizarLocalidad = exports.BorrarZona = exports.BorrarLocalidad = exports.NuevaLocalidad = exports.NuevaZona = exports.ObtenerZonas = void 0;
const error_handle_1 = require("../utils/error.handle");
const zona_service_1 = require("../services/zona.service");
const database_1 = __importDefault(require("../config/database"));
const request_ip_1 = __importDefault(require("request-ip"));
const registro_service_1 = require("../services/registro.service");
const ObtenerZonas = async (req, res) => {
    try {
        const listado = await (0, zona_service_1.obtenerZonas)();
        const data = { "data": listado, "mensaje": "Zonas Encontradas" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las Zonas', e);
    }
};
exports.ObtenerZonas = ObtenerZonas;
const NuevaZona = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const zona = await (0, zona_service_1.nuevaZona)(req.body, transaction);
        const data = { "data": zona, "mensaje": "Zona dada de alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 8, zona.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al crear la Zona', e);
    }
};
exports.NuevaZona = NuevaZona;
const NuevaLocalidad = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const localidad = await (0, zona_service_1.nuevaLocalidad)(req.body, transaction);
        const data = { "data": localidad, "mensaje": "Localidad dada de alta" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 7, localidad.id, "Alta", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al crear la Localidad', e);
    }
};
exports.NuevaLocalidad = NuevaLocalidad;
const ActualizarLocalidad = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const localidad = await (0, zona_service_1.actualizarLocalidad)(req.body, transaction);
        const data = { "data": localidad, "mensaje": "Localidad Actualizada" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 7, localidad.id, "Actualizar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar la Localidad', e);
    }
};
exports.ActualizarLocalidad = ActualizarLocalidad;
const ActualizarZona = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const zona = await (0, zona_service_1.actualizarZona)(req.body, transaction);
        const data = { "data": zona, "mensaje": "Zona Actualizada" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 8, zona.id, "Actualizar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar la Zona', e);
    }
};
exports.ActualizarZona = ActualizarZona;
const BorrarZona = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { id } = req.query;
        const zona = await (0, zona_service_1.borrarZona)(id, transaction);
        const data = { "data": zona, "mensaje": "Zona eliminada" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 8, zona.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al borrar la Zona', e);
    }
};
exports.BorrarZona = BorrarZona;
const BorrarLocalidad = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const { id } = req.query;
        const localidad = await (0, zona_service_1.borrarLocalidad)(id, transaction);
        const data = { "data": localidad, "mensaje": "Localidad eliminada" };
        const idUsuario = req.user?.id;
        const idRol = req.user?.id_rol;
        await (0, registro_service_1.registrarEvento)(idUsuario, idRol, 7, localidad.id, "Borrar", data.mensaje, request_ip_1.default.getClientIp(req) || 'No Disponible', req.headers['user-agent'] || 'No Disponible', transaction);
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al borrar la Localidad', e);
    }
};
exports.BorrarLocalidad = BorrarLocalidad;
