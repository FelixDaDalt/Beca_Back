"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.editar = exports.borrar = exports.obtenerUsuario = exports.resetarPass = exports.suspender = exports.obtenerTyc = exports.aceptarTyc = exports.cambiarPassword = void 0;
const password_handle_1 = require("../utils/password.handle");
const usuario_1 = require("../models/usuario");
const colegio_1 = require("../models/colegio");
const bcryptjs_1 = require("bcryptjs");
const tyc_1 = require("../models/tyc");
const administrador_1 = require("../models/administrador");
const roles_1 = require("../models/roles");
const cambiarPassword = async (pass, idUsuario, idRol, transaction) => {
    try {
        if (!pass || !idUsuario) {
            const error = new Error('Debe proporcionar un ID usuario y una Contraseña');
            error.statusCode = 400;
            throw error;
        }
        let usuarioEncontrado;
        if (Number(idRol) > 0) {
            usuarioEncontrado = await usuario_1.usuario.findOne({
                where: {
                    id: idUsuario,
                    borrado: 0,
                }, include: [{
                        model: colegio_1.colegio,
                        as: 'id_colegio_colegio',
                        required: true
                    },
                    {
                        model: roles_1.roles,
                        as: 'id_rol_role',
                        attributes: ['descripcion'],
                        required: true
                    }],
                transaction
            });
        }
        else {
            usuarioEncontrado = await administrador_1.administrador.findOne({
                where: {
                    id: idUsuario,
                    borrado: 0
                }, transaction
            });
        }
        if (!usuarioEncontrado) {
            const error = new Error('No se encontro usuario con ID proporcionado');
            error.statusCode = 409;
            throw error;
        }
        const passEncrypt = await (0, password_handle_1.encriptar)(pass);
        usuarioEncontrado.password = passEncrypt;
        usuarioEncontrado.cambiarPass = 0;
        await usuarioEncontrado.save({ transaction });
        const { password, borrado, ...usuarioLogueado } = usuarioEncontrado.dataValues;
        return { datos: usuarioLogueado };
    }
    catch (error) {
        throw error;
    }
};
exports.cambiarPassword = cambiarPassword;
const aceptarTyc = async (idUsuario, pass, transaction) => {
    try {
        if (!pass || !idUsuario) {
            const error = new Error('Debe proporcionar un ID usuario y una Contraseña');
            error.statusCode = 400;
            throw error;
        }
        // 1. Buscar al usuario existente
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: { id: idUsuario, borrado: 0 },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: true,
                    attributes: ['suspendido', 'nombre'],
                },
                {
                    model: roles_1.roles,
                    as: 'id_rol_role',
                    attributes: ['descripcion'],
                    required: true
                }],
            transaction
        });
        // 2. Lanzar un error si el usuario no existe
        if (!usuarioExistente) {
            const error = new Error('Usuario inexistente');
            error.statusCode = 400;
            throw error;
        }
        // 3. Validar la contraseña
        const contraseñaValida = await (0, bcryptjs_1.compare)(pass, usuarioExistente.password);
        if (!contraseñaValida) {
            const error = new Error('Contraseña incorrecta');
            error.statusCode = 400;
            throw error;
        }
        // 4. Aceptar Termino
        usuarioExistente.tyc = 1;
        // 5. Guardar los cambios en el usuario
        await usuarioExistente.save({ transaction });
        const { password, borrado, ...usuarioLogueado } = usuarioExistente.dataValues;
        return { datos: usuarioLogueado };
    }
    catch (error) {
        throw error;
    }
};
exports.aceptarTyc = aceptarTyc;
const obtenerTyc = async () => {
    try {
        const tycExistente = await tyc_1.tyc.findOne({
            order: [['id', 'DESC']] // O usa `id` si es autoincremental
        });
        return tycExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.obtenerTyc = obtenerTyc;
const suspender = async (idRol, idUsuario, transaction) => {
    try {
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: {
                id: idUsuario,
                borrado: 0
            }
        });
        if (!usuarioExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        if (idRol > usuarioExistente.id_rol) {
            const error = new Error('No tiene permisos para suspender al usuario');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        usuarioExistente.suspendido = usuarioExistente.suspendido == 1 ? 0 : 1;
        // Guardar cambios
        await usuarioExistente.save({ transaction });
        // 4. Retornar
        return usuarioExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.suspender = suspender;
const borrar = async (idRol, idUsuario, transaction) => {
    try {
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: {
                id: idUsuario,
                borrado: 0
            }
        });
        if (!usuarioExistente) {
            const error = new Error('El Usuario no existe');
            error.statusCode = 400;
            throw error;
        }
        if (idRol > usuarioExistente.id_rol) {
            const error = new Error('No tiene permisos para borrar al usuario');
            error.statusCode = 400;
            throw error;
        }
        const usuariosConRol = await usuario_1.usuario.count({
            where: {
                id_colegio: usuarioExistente.id_colegio,
                id_rol: usuarioExistente.id_rol,
                borrado: 0
            }
        });
        if (usuarioExistente.id_rol === 1 && usuariosConRol === 1) {
            const error = new Error('No se puede eliminar el único usuario con rol de responsable del colegio');
            error.statusCode = 400;
            throw error;
        }
        // Cambiar estado de suspensión
        usuarioExistente.borrado = 1;
        // Guardar cambios
        await usuarioExistente.save({ transaction });
        // 4. Retornar
        return usuarioExistente;
    }
    catch (error) {
        throw error;
    }
};
exports.borrar = borrar;
const resetarPass = async (idRol, transaction, userId, adminId) => {
    try {
        let findUser;
        if (userId) {
            findUser = await usuario_1.usuario.findOne({
                where: {
                    id: userId,
                    borrado: 0
                },
                attributes: {
                    exclude: ['borrado', 'password']
                },
                transaction,
            });
            if (!findUser) {
                const error = new Error('No se encontró el usuario');
                error.statusCode = 409;
                throw error;
            }
            if (findUser.id_rol < idRol) {
                const error = new Error('No tienes permiso para reiniciar el password del usuario');
                error.statusCode = 409;
                throw error;
            }
            const dni = findUser.dni;
            const passEncrypt = await (0, password_handle_1.encriptar)(dni);
            findUser.password = passEncrypt;
            findUser.cambiarPass = 1;
            await findUser.save({ transaction });
        }
        else if (adminId) {
            findUser = await administrador_1.administrador.findOne({
                where: {
                    id: adminId,
                    borrado: 0
                },
                attributes: {
                    exclude: ['borrado', 'password']
                },
                transaction,
            });
            if (!findUser) {
                const error = new Error('No se encontró el administrador');
                error.statusCode = 409;
                throw error;
            }
            if (idRol > findUser.id_rol) {
                const error = new Error('No tienes permiso para reiniciar el password del usuario');
                error.statusCode = 409;
                throw error;
            }
            const dni = findUser.dni;
            const passEncrypt = await (0, password_handle_1.encriptar)(dni);
            findUser.password = passEncrypt;
            findUser.cambiarPass = 1;
            await findUser.save({ transaction });
        }
        else {
            const error = new Error('Se debe proporcionar ID usuario o administrador para restablecer la contraseña');
            error.statusCode = 400;
            throw error;
        }
        return findUser;
    }
    catch (error) {
        throw error;
    }
};
exports.resetarPass = resetarPass;
const obtenerUsuario = async (idUsuario) => {
    try {
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: [{
                    id: idUsuario,
                    borrado: 0
                }],
            attributes: { exclude: ['borrado', 'password'] },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: false,
                    attributes: ['id', 'nombre', 'cuit']
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
exports.obtenerUsuario = obtenerUsuario;
const editar = async (update, idUsuario, idRol, transaction, idColegio) => {
    try {
        if (idRol > 1 && update.id != idUsuario) {
            const error = new Error('No puedes editar otro usuario');
            error.statusCode = 400;
            throw error;
        }
        const usuarioExistente = await usuario_1.usuario.findOne({
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
        if (idRol == 1 && usuarioExistente.id_colegio != idColegio) {
            const error = new Error('No puedes editar el usuario de otro colegio');
            error.statusCode = 400;
            throw error;
        }
        const estadoAnterior = { ...usuarioExistente.toJSON() };
        await usuario_1.usuario.update(update, {
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
exports.editar = editar;
const me = async (idUsuario) => {
    try {
        const usuarioExistente = await usuario_1.usuario.findOne({
            where: [{
                    id: idUsuario,
                    borrado: 0
                }],
            attributes: { exclude: ['borrado', 'password'] },
            include: [{
                    model: colegio_1.colegio,
                    as: 'id_colegio_colegio',
                    required: false,
                    attributes: ['id', 'nombre', 'cuit', 'foto']
                }, {
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
