"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarReporte = exports.listadoReportes = exports.nuevoReporte = void 0;
const usuario_1 = require("../models/usuario");
const reporte_error_1 = require("../models/reporte_error");
const nuevoReporte = async (idUsuario, nuevoReporte, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: {
                id: idUsuario,
                borrado: 0
            },
            transaction,
        });
        if (!usuarioExistente) {
            const error = new Error('No se proporciono un usuario valido');
            error.statusCode = 400;
            throw error;
        }
        // 3. Agregar el colegio
        nuevoReporte.id_usuario = idUsuario;
        const agregarReporte = await reporte_error_1.reporte_error.create(nuevoReporte, { transaction }); // Incluye la transacción
        return agregarReporte;
    }
    catch (error) {
        throw error;
    }
};
exports.nuevoReporte = nuevoReporte;
const listadoReportes = async (filtro = {}) => {
    try {
        const { page = 1, pageSize = 10, fechaDesde, fechaHasta } = filtro;
        const where = {};
        // 🎯 Filtro de fecha (usando "fecha" en lugar de "createdAt")
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) {
                where.fecha['$gte'] = new Date(fechaDesde + 'T00:00:00.000Z');
            }
            if (fechaHasta) {
                where.fecha['$lte'] = new Date(fechaHasta + 'T23:59:59.999Z');
            }
        }
        const reportesEncontrados = await reporte_error_1.reporte_error.findAndCountAll({
            where,
            include: [{
                    model: usuario_1.usuario,
                    as: 'id_usuario_usuario',
                    required: false
                }],
            order: [['fecha', 'DESC']], // 🔥 Ordenado por fecha (más nueva primero)
            limit: pageSize,
            offset: (page - 1) * pageSize
        });
        return {
            total: reportesEncontrados.count,
            paginas: Math.ceil(reportesEncontrados.count / pageSize),
            paginaActual: page,
            data: reportesEncontrados.rows
        };
    }
    catch (error) {
        throw error;
    }
};
exports.listadoReportes = listadoReportes;
const borrarReporte = async (idReporte, transaction) => {
    try {
        const reporteExistente = await reporte_error_1.reporte_error.findOne({
            where: {
                id: idReporte,
                borrado: 0
            }
        });
        if (!reporteExistente) {
            const error = new Error('El Reporte no existe');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        reporteExistente.borrado = 1;
        // Guardar cambios
        await reporteExistente.save({ transaction });
        // 4. Retornar
        return reporteExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarReporte = borrarReporte;
