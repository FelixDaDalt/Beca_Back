"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerEjecuciones = void 0;
const sequelize_1 = require("sequelize");
const beca_automatizacion_ejecucion_1 = require("../models/beca_automatizacion_ejecucion");
const beca_automatizacion_log_1 = require("../models/beca_automatizacion_log");
const obtenerEjecuciones = async (filtro = {}) => {
    try {
        const { page = 1, pageSize = 10, fechaDesde, fechaHasta, tipos } = filtro;
        const where = {};
        // 🎯 Filtro de fecha (usando "fecha" en lugar de "createdAt")
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) {
                where.fecha[sequelize_1.Op.gte] = new Date(fechaDesde + 'T00:00:00');
            }
            if (fechaHasta) {
                where.fecha[sequelize_1.Op.lte] = new Date(fechaHasta + 'T23:59:59');
            }
        }
        // 🎯 Filtro de tipos
        if (tipos && tipos.length > 0) {
            where.tipo = tipos;
        }
        const ejecucionesEncontradas = await beca_automatizacion_ejecucion_1.beca_automatizacion_ejecucion.findAndCountAll({
            where,
            include: [{
                    model: beca_automatizacion_log_1.beca_automatizacion_log,
                    as: 'beca_automatizacion_logs',
                    required: false
                }],
            order: [['fecha', 'DESC']], // 🔥 Ordenado por fecha (más nueva primero)
            limit: pageSize,
            offset: (page - 1) * pageSize
        });
        return {
            total: ejecucionesEncontradas.count,
            paginas: Math.ceil(ejecucionesEncontradas.count / pageSize),
            paginaActual: page,
            data: ejecucionesEncontradas.rows
        };
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerEjecuciones = obtenerEjecuciones;
