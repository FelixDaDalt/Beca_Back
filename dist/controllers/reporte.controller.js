"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrarReporte = exports.NuevoReporte = exports.ObtenerReportes = void 0;
const error_handle_1 = require("../utils/error.handle");
const database_1 = __importDefault(require("../config/database"));
const reporte_service_1 = require("../services/reporte.service");
const ObtenerReportes = async (req, res) => {
    try {
        const { page, pageSize, fechaDesde, fechaHasta, tipos } = req.query;
        const listado = await (0, reporte_service_1.listadoReportes)({
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 10,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
        });
        const data = { "data": listado, "mensaje": "Listado de Reportes obtenidos" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener el listado de Reportes', e);
    }
};
exports.ObtenerReportes = ObtenerReportes;
const NuevoReporte = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const reporte = await (0, reporte_service_1.nuevoReporte)(idUsuario, req.body, transaction);
        const data = { "data": reporte,
            "mensaje": "Nuevo Reporte registrado",
            "log": `/ Usuario(id):${reporte.id_usuario}` };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al registrar el Reporte', e);
    }
};
exports.NuevoReporte = NuevoReporte;
const BorrarReporte = async (req, res) => {
    const transaction = await database_1.default.transaction();
    try {
        const idUsuario = req.user?.id;
        const { idReporte } = req.query;
        const reporte = await (0, reporte_service_1.borrarReporte)(idReporte, transaction);
        const data = {
            "data": reporte,
            mensaje: "Reporte Eliminado",
            "log": `/ Reporte(id):${reporte.id}`
        };
        await transaction.commit();
        res.status(200).send(data);
    }
    catch (e) {
        await transaction.rollback();
        (0, error_handle_1.handleHttp)(res, 'Error al eliminar el Reporte.', e);
    }
};
exports.BorrarReporte = BorrarReporte;
