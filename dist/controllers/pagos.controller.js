"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarPagos = exports.ObtenerPagos = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const pagos_service_1 = require("../services/pagos.service");
const ObtenerPagos = async (req, res) => {
    try {
        const listado = await (0, pagos_service_1.obtenerPagos)();
        const data = { "data": listado, "mensaje": "Formas de Pago Encontrado" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener Las formas de Pago', e);
    }
};
exports.ObtenerPagos = ObtenerPagos;
const ActualizarPagos = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const plan = await (0, pagos_service_1.actualizarPagos)(req.body, transaction);
        const data = { "data": plan, "mensaje": "Forma de Pago Actualizado", "log": `/ Forma de Pago(id):${plan.id}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al actualizar la Forma de Pago', e);
    }
};
exports.ActualizarPagos = ActualizarPagos;
