"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarPagos = exports.obtenerPagos = void 0;
const forma_pago_1 = require("../models/forma_pago");
const obtenerPagos = async () => {
    try {
        const pagosEncontrados = await forma_pago_1.forma_pago.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
        });
        return pagosEncontrados;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerPagos = obtenerPagos;
const actualizarPagos = async (datosActualizados, transaction) => {
    try {
        // 1. Buscar la plan y verificar que no esté borrada
        const pagoEncontrado = await forma_pago_1.forma_pago.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });
        if (!pagoEncontrado) {
            const error = new Error('La Forma de pago no existe');
            error.statusCode = 400;
            throw error;
        }
        // 2. Actualizar los datos de la plan
        await pagoEncontrado.update(datosActualizados, { transaction });
        // 5. Retornar
        return pagoEncontrado;
    }
    catch (error) {
        throw error;
    }
};
exports.actualizarPagos = actualizarPagos;
