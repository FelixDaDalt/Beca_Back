"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarParametro = exports.ObtenerParametros = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const parametros_service_1 = require("../services/parametros.service");
const ObtenerParametros = async (req, res) => {
    try {
        const listado = await (0, parametros_service_1.obtenerParametros)();
        const data = { "data": listado, "mensaje": "Zonas Encontradas" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las Zonas', e);
    }
};
exports.ObtenerParametros = ObtenerParametros;
const ActualizarParametro = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const parametro = await (0, parametros_service_1.actualizarParametro)(req.body, transaction);
        const data = { "data": parametro, "mensaje": "Parametro Actualizado", "log": `/ Parametro(id):${parametro.id}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar la Zona', e);
    }
};
exports.ActualizarParametro = ActualizarParametro;
