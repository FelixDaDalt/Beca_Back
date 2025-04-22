"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarAutorizado = exports.suspenderAutorizado = exports.editarAutorizado = exports.obtenerAutorizado = exports.listadoAutorizados = exports.altaAutorizado = void 0;
const sequelize_1 = require("sequelize");
const autorizados_1 = require("../models/autorizados");
const altaAutorizado = async (idColegio, nuevoAutorizado, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const autorizadoExistente = await autorizados_1.autorizados.findOne({
            where: {
                dni: nuevoAutorizado.dni,
                id_colegio: idColegio,
                borrado: 0
            },
            transaction,
        });
        if (autorizadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado en el colegio');
            error.statusCode = 400;
            throw error;
        }
        // 3. Agregar el colegio
        nuevoAutorizado.id_colegio = idColegio;
        const agregarAutorizado = await autorizados_1.autorizados.create(nuevoAutorizado, { transaction }); // Incluye la transacción
        // 5. Devolver el token y los datos del usuario al cliente
        const { borrado, ...AutorizadoRegistrado } = agregarAutorizado.dataValues;
        return { ...AutorizadoRegistrado };
    }
    catch (error) {
        throw error;
    }
};
exports.altaAutorizado = altaAutorizado;
const listadoAutorizados = async (idConsulta, id_colegio) => {
    try {
        const listado = await autorizados_1.autorizados.findAll({
            where: {
                id_colegio: id_colegio,
                borrado: 0,
                id: { [sequelize_1.Op.ne]: idConsulta }
            },
            attributes: { exclude: ['borrado'] },
        });
        return listado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoAutorizados = listadoAutorizados;
const obtenerAutorizado = async (idAutorizado) => {
    try {
        const autorizadoExistente = await autorizados_1.autorizados.findOne({
            where: [{
                    id: idAutorizado,
                    borrado: 0
                }],
            attributes: { exclude: ['borrado'] }
        });
        if (!autorizadoExistente) {
            const error = new Error('Usuario inexistente');
            error.statusCode = 400;
            throw error;
        }
        return autorizadoExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerAutorizado = obtenerAutorizado;
const editarAutorizado = async (update, idUsuario, idRol, transaction, idColegio) => {
    try {
        if (idRol > 1 && update.id != idUsuario) {
            const error = new Error('No puedes editar otro usuario');
            error.statusCode = 400;
            throw error;
        }
        const autorizadoExistente = await autorizados_1.autorizados.findOne({
            where: {
                id: update.id,
                borrado: 0
            }
        });
        if (!autorizadoExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        if (idRol == 1 && autorizadoExistente.id_colegio != idColegio) {
            const error = new Error('No puedes editar el usuario de otro colegio');
            error.statusCode = 400;
            throw error;
        }
        const estadoAnterior = { ...autorizadoExistente.toJSON() };
        await autorizados_1.autorizados.update(update, {
            where: { id: update.id },
            transaction,
        });
        // 4. Retornar
        return update;
    }
    catch (error) {
        throw error;
    }
};
exports.editarAutorizado = editarAutorizado;
const suspenderAutorizado = async (idUsuario, idColegio, transaction) => {
    try {
        const autorizadoExistente = await autorizados_1.autorizados.findOne({
            where: {
                id: idUsuario,
                id_colegio: idColegio,
                borrado: 0
            }
        });
        if (!autorizadoExistente) {
            const error = new Error('El Autorizado no existe');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        autorizadoExistente.suspendido = autorizadoExistente.suspendido == 1 ? 0 : 1;
        // Guardar cambios
        await autorizadoExistente.save({ transaction });
        // 4. Retornar
        return autorizadoExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.suspenderAutorizado = suspenderAutorizado;
const borrarAutorizado = async (idUsuario, idColegio, transaction) => {
    try {
        const autorizadoExistente = await autorizados_1.autorizados.findOne({
            where: {
                id: idUsuario,
                id_colegio: idColegio,
                borrado: 0
            }
        });
        if (!autorizadoExistente) {
            const error = new Error('El Autorizado no existe');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        autorizadoExistente.borrado = 1;
        // Guardar cambios
        await autorizadoExistente.save({ transaction });
        // 4. Retornar
        return autorizadoExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarAutorizado = borrarAutorizado;
