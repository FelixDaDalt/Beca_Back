"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SincronizarRed = exports.ComprobarRed = exports.ObtenerEjecuciones = exports.ProcesarVencidas = exports.ProcesarPorVencer = exports.ProcesarBajas = void 0;
const error_handle_1 = require("../utils/error.handle");
const tareas_1 = require("../tareas/tareas");
const tareas_service_1 = require("../services/tareas.service");
const ProcesarBajas = async (req, res) => {
    try {
        const listado = await (0, tareas_1.procesarBecasDadaBaja)();
        const data = { "data": listado, "mensaje": "Becas PENDIENTES DE BAJA procesadas correctamente.", "log": `/ ID(id):${listado.id}`, };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al procesar las Becas PENDIENTES DE BAJA', e);
    }
};
exports.ProcesarBajas = ProcesarBajas;
const ProcesarPorVencer = async (req, res) => {
    try {
        const listado = await (0, tareas_1.notificarBecasPorVencer)();
        const data = { "data": listado, "mensaje": "Becas POR VENCER procesadas correctamente.", "log": `/ ID(id):${listado.id}` };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al procesar las Becas POR VENCER', e);
    }
};
exports.ProcesarPorVencer = ProcesarPorVencer;
const ProcesarVencidas = async (req, res) => {
    try {
        const listado = await (0, tareas_1.notificarBecasVencidas)();
        const data = { "data": listado, "mensaje": "Becas VENCIDAS procesadas correctamente.", "log": `/ ID(id):${listado.id}` };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al procesar las Becas VENCIDAS', e);
    }
};
exports.ProcesarVencidas = ProcesarVencidas;
const ObtenerEjecuciones = async (req, res) => {
    try {
        const { page, pageSize, fechaDesde, fechaHasta, tipos } = req.query;
        const listado = await (0, tareas_service_1.obtenerEjecuciones)({
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 10,
            fechaDesde: fechaDesde,
            fechaHasta: fechaHasta,
            tipos: tipos
                ? (Array.isArray(tipos) ? tipos.map(t => t.toString()) : [tipos.toString()])
                : undefined
        });
        const data = { data: listado, mensaje: "Ejecuciones encontradas correctamente." };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtener las ejecuciones', e);
    }
};
exports.ObtenerEjecuciones = ObtenerEjecuciones;
const ComprobarRed = async (req, res) => {
    try {
        const { idRed } = req.query;
        const listado = await (0, tareas_1.comprobarRed)(idRed);
        const data = { "data": listado, "mensaje": "Miembros encontrados" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al obtenerla los miembros', e);
    }
};
exports.ComprobarRed = ComprobarRed;
const SincronizarRed = async (req, res) => {
    try {
        const { idRed } = req.query;
        const listado = await (0, tareas_1.sincronizarRedColegios)(idRed);
        const data = { "data": listado, "mensaje": "Sincronizado Correcto" };
        res.status(200).send(data);
    }
    catch (e) {
        (0, error_handle_1.handleHttp)(res, 'Error al sincronizar', e);
    }
};
exports.SincronizarRed = SincronizarRed;
