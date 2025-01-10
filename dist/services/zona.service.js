"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarLocalidad = exports.actualizarZona = exports.borrarLocalidad = exports.borrarZona = exports.nuevaLocalidad = exports.nuevaZona = exports.obtenerZonas = void 0;
const zona_localidad_1 = require("../models/zona_localidad");
const zona_1 = require("../models/zona");
const obtenerZonas = async () => {
    try {
        const zonasEncontradas = await zona_1.zona.findAll({
            where: {
                borrado: 0
            },
            attributes: { exclude: ['borrado'] },
            include: [{
                    model: zona_localidad_1.zona_localidad,
                    as: 'zona_localidad',
                    required: false,
                    attributes: { exclude: ['borrado'] }
                }]
        });
        return zonasEncontradas;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerZonas = obtenerZonas;
const nuevaZona = async (zonaNueva, transaction) => {
    try {
        // 1. Dar de alta los terminos
        const nuevaZona = await zona_1.zona.create(zonaNueva, { transaction });
        // 4. Retornar
        return nuevaZona;
    }
    catch (error) {
        throw error;
    }
};
exports.nuevaZona = nuevaZona;
const nuevaLocalidad = async (localidadNueva, transaction) => {
    // Inicia la transacción
    try {
        // 1. bucar si existe la zona
        const zonaEncontrada = await zona_1.zona.findOne({
            where: {
                id: localidadNueva.id_zona,
                borrado: 0
            },
            transaction
        });
        if (!zonaEncontrada) {
            const error = new Error('La zona no existe para crear la localidad');
            error.statusCode = 400;
            throw error;
        }
        // 2. Dar de alta la localidad
        const nuevo = await zona_localidad_1.zona_localidad.create(localidadNueva, { transaction });
        // 5. Retornar
        return nuevo;
    }
    catch (error) {
        throw error;
    }
};
exports.nuevaLocalidad = nuevaLocalidad;
const borrarZona = async (idZona, transaction) => {
    try {
        // 1. Buscar la zona y verificar si ya está borrada
        const zonaEncontrada = await zona_1.zona.findOne({
            where: { id: idZona, borrado: 0 },
            transaction
        });
        if (!zonaEncontrada) {
            const error = new Error('La zona no existe o ya está borrada');
            error.statusCode = 400;
            throw error;
        }
        // 2. Marcar la zona como borrada
        await zonaEncontrada.update({ borrado: 1 }, { transaction });
        // 5. Retornar
        return zonaEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarZona = borrarZona;
const borrarLocalidad = async (idLocalidad, transaction) => {
    try {
        // 1. Buscar la localidad y verificar si ya está borrada
        const localidadEncontrada = await zona_localidad_1.zona_localidad.findOne({
            where: { id: idLocalidad, borrado: 0 },
            transaction
        });
        if (!localidadEncontrada) {
            const error = new Error('La localidad no existe o ya está borrada');
            error.statusCode = 400;
            throw error;
        }
        // 2. Marcar la localidad como borrada
        await localidadEncontrada.update({ borrado: 1 }, { transaction });
        // 5. Retornar
        return localidadEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarLocalidad = borrarLocalidad;
const actualizarZona = async (datosActualizados, transaction) => {
    try {
        // 1. Buscar la zona y verificar que no esté borrada
        const zonaEncontrada = await zona_1.zona.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });
        if (!zonaEncontrada) {
            const error = new Error('La zona no existe o está borrada');
            error.statusCode = 400;
            throw error;
        }
        // 2. Actualizar los datos de la zona
        await zonaEncontrada.update(datosActualizados, { transaction });
        // 5. Retornar
        return zonaEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.actualizarZona = actualizarZona;
const actualizarLocalidad = async (datosActualizados, transaction) => {
    try {
        // 1. Buscar la localidad y verificar que no esté borrada
        const localidadEncontrada = await zona_localidad_1.zona_localidad.findOne({
            where: { id: datosActualizados.id, borrado: 0 },
            transaction
        });
        if (!localidadEncontrada) {
            const error = new Error('La localidad no existe o está borrada');
            error.statusCode = 400;
            throw error;
        }
        const zonaEncontrada = await zona_1.zona.findOne({
            where: {
                id: datosActualizados.id_zona,
                borrado: 0
            },
            transaction
        });
        if (!zonaEncontrada) {
            const error = new Error('La zona no existe para crear la localidad');
            error.statusCode = 400;
            throw error;
        }
        // 2. Actualizar los datos de la localidad
        await localidadEncontrada.update(datosActualizados, { transaction });
        // 5. Retornar
        return localidadEncontrada;
    }
    catch (error) {
        throw error;
    }
};
exports.actualizarLocalidad = actualizarLocalidad;
