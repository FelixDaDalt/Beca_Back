"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarParametro = exports.obtenerParametros = void 0;
const parametros_1 = require("../models/parametros");
const obtenerParametros = async () => {
    try {
        const parametrosEncontrados = await parametros_1.parametros.findAll({
            attributes: { exclude: ['clave'] },
        });
        return parametrosEncontrados;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerParametros = obtenerParametros;
const actualizarParametro = async (parametro, transaction) => {
    try {
        // 1. Buscar la zona y verificar que no esté borrada
        const parametroEncontrado = await parametros_1.parametros.findOne({
            where: { id: parametro.id },
            transaction
        });
        if (!parametroEncontrado) {
            const error = new Error('Parametro no encontrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Actualizar los datos de la zona
        await parametroEncontrado.update(parametro, { transaction });
        // 5. Retornar
        return parametroEncontrado;
    }
    catch (error) {
        throw error;
    }
};
exports.actualizarParametro = actualizarParametro;
