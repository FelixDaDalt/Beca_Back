"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizar = exports.me = exports.borrarAdministrador = exports.obtenerAdministrador = exports.suspenderAdministrador = exports.listadoAdministradores = exports.comprobarDisponibilidad = exports.altaAdministrador = exports.nuevoTyc = exports.listadoTyc = void 0;
const password_handle_1 = require("../utils/password.handle");
const administrador_1 = require("../models/administrador");
const colegio_1 = require("../models/colegio");
const usuario_1 = require("../models/usuario");
const tyc_1 = require("../models/tyc");
const sequelize_1 = require("sequelize");
const roles_1 = require("../models/roles");
const altaAdministrador = async (nuevoAdmin, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const administradorExistente = await administrador_1.administrador.findOne({
            where: {
                dni: nuevoAdmin.dni,
                borrado: 0
            },
            transaction,
        });
        if (administradorExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Encriptar contraseña
        const passEncrypt = await (0, password_handle_1.encriptar)(nuevoAdmin.password);
        nuevoAdmin.password = passEncrypt;
        nuevoAdmin.cambiarPass = 1;
        // 3. Agregar el administrador
        const agregarAdmin = await administrador_1.administrador.create(nuevoAdmin, { transaction }); // Incluye la transacción
        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, ...administradorRegistrado } = agregarAdmin.dataValues;
        return { ...administradorRegistrado };
    }
    catch (error) {
        throw error;
    }
};
exports.altaAdministrador = altaAdministrador;
const listadoAdministradores = async (idConsulta) => {
    try {
        const listado = await administrador_1.administrador.findAll({
            where: {
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
exports.listadoAdministradores = listadoAdministradores;
const suspenderAdministrador = async (idRol, idUsuario, transaction) => {
    try {
        const adminExistente = await administrador_1.administrador.findOne({
            where: {
                id: idUsuario,
                borrado: 0
            }
        });
        if (!adminExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        if (idRol > adminExistente.id_rol) {
            const error = new Error('No tiene permisos para suspender al usuario');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        adminExistente.suspendido = adminExistente.suspendido == 1 ? 0 : 1;
        // Guardar cambios
        await adminExistente.save({ transaction });
        // 4. Retornar
        return adminExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.suspenderAdministrador = suspenderAdministrador;
const borrarAdministrador = async (idRol, idUsuario, transaction) => {
    try {
        const adminExistente = await administrador_1.administrador.findOne({
            where: {
                id: idUsuario,
                borrado: 0
            }
        });
        if (!adminExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        if (idRol > adminExistente.id_rol) {
            const error = new Error('No tiene permisos para eliminar al usuario');
            error.statusCode = 400;
            throw error;
        }
        const usuariosAdmin = await administrador_1.administrador.count({
            where: {
                id_rol: 0,
                borrado: 0
            }
        });
        if (usuariosAdmin === 1) {
            const error = new Error('No se puede eliminar el único usuario Administrador');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        adminExistente.borrado = 1;
        // Guardar cambios
        await adminExistente.save({ transaction });
        // 4. Retornar
        return adminExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.borrarAdministrador = borrarAdministrador;
const obtenerAdministrador = async (idUsuario) => {
    try {
        const administradorExistente = await administrador_1.administrador.findOne({
            where: [{
                    id: idUsuario,
                    borrado: 0
                }],
            attributes: { exclude: ['borrado', 'password'] }
        });
        if (!administradorExistente) {
            const error = new Error('Usuario inexistente');
            error.statusCode = 400;
            throw error;
        }
        return administradorExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerAdministrador = obtenerAdministrador;
const actualizar = async (update, idUsuario, transaction) => {
    try {
        if (update.id != idUsuario) {
            const error = new Error('No puedes editar otro usuario');
            error.statusCode = 400;
            throw error;
        }
        const usuarioExistente = await administrador_1.administrador.findOne({
            where: {
                id: update.id,
                borrado: 0
            }
        });
        if (!usuarioExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        const estadoAnterior = { ...usuarioExistente.toJSON() };
        await administrador_1.administrador.update(update, {
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
exports.actualizar = actualizar;
const me = async (idUsuario) => {
    try {
        const usuarioExistente = await administrador_1.administrador.findOne({
            where: [{
                    id: idUsuario,
                    borrado: 0
                }],
            attributes: { exclude: ['borrado', 'password'] },
            include: [{
                    model: roles_1.roles,
                    as: 'id_rol_role',
                    required: false,
                    attributes: ['descripcion']
                }]
        });
        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            error.statusCode = 400;
            throw error;
        }
        return usuarioExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.me = me;
const comprobarDisponibilidad = async (cuit, dni, url, dniAdmin) => {
    try {
        let resultado = { disponible: false };
        if (cuit) {
            const findCuit = await colegio_1.colegio.findOne({ where: { cuit, borrado: 0 } });
            resultado.disponible = !findCuit; // Si no existe, es disponible
            return resultado;
        }
        if (dni) {
            const findDni = await usuario_1.usuario.findOne({ where: { dni, borrado: 0 } });
            resultado.disponible = !findDni; // Si no existe, es disponible
            return resultado;
        }
        if (url) {
            const findUrl = await colegio_1.colegio.findOne({ where: { url } });
            resultado.disponible = !findUrl; // Si no existe, es disponible
            return resultado;
        }
        if (dniAdmin) {
            const dni = dniAdmin;
            const findDniAdmin = await administrador_1.administrador.findOne({ where: { dni, borrado: 0 } });
            resultado.disponible = !findDniAdmin; // Si no existe, es disponible
            return resultado;
        }
        const error = new Error('Se debe proporcionar CUIT, DNI o URL para comprobar la disponibilidad.');
        error.statusCode = 400;
        throw error;
    }
    catch (error) {
        throw error;
    }
};
exports.comprobarDisponibilidad = comprobarDisponibilidad;
const nuevoTyc = async (nuevoTyc, transaction) => {
    try {
        // 1. Dar de alta los terminos
        const nuevo = await tyc_1.tyc.create(nuevoTyc, { transaction });
        // 2. Actualizar todos los usuarios a `tyc: 0`
        await usuario_1.usuario.update({ tyc: 0 }, { where: {}, transaction });
        // 5. Retornar
        return nuevo;
    }
    catch (error) {
        throw error;
    }
};
exports.nuevoTyc = nuevoTyc;
const listadoTyc = async () => {
    try {
        // Obtener todos los términos ordenados por 'id' en orden descendente
        const listado = await tyc_1.tyc.findAll({
            order: [['id', 'DESC']]
        });
        return listado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoTyc = listadoTyc;
