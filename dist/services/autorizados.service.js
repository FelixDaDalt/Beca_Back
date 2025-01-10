"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listadoAutorizados = exports.altaAutorizado = void 0;
const password_handle_1 = require("../utils/password.handle");
const usuario_1 = require("../models/usuario");
const sequelize_1 = require("sequelize");
const altaAutorizado = async (idColegio, nuevoAutorizado, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const autorizadoExistente = await usuario_1.usuario.findOne({
            where: {
                dni: nuevoAutorizado.dni,
                borrado: 0
            },
            transaction,
        });
        if (autorizadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Encriptar contraseña
        const passEncrypt = await (0, password_handle_1.encriptar)(nuevoAutorizado.password);
        nuevoAutorizado.password = passEncrypt;
        // 3. Agregar el delegado
        nuevoAutorizado.id_rol = 3;
        nuevoAutorizado.id_colegio = idColegio;
        nuevoAutorizado.cambiarPass = 1;
        const agregarAutorizado = await usuario_1.usuario.create(nuevoAutorizado, { transaction }); // Incluye la transacción
        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...AutorizadoRegistrado } = agregarAutorizado.dataValues;
        return { ...AutorizadoRegistrado };
    }
    catch (error) {
        throw error;
    }
};
exports.altaAutorizado = altaAutorizado;
const listadoAutorizados = async (idConsulta, id_colegio) => {
    try {
        const listado = await usuario_1.usuario.findAll({
            where: {
                id_rol: 3,
                id_colegio: id_colegio,
                borrado: 0,
                id: { [sequelize_1.Op.ne]: idConsulta }
            },
            attributes: { exclude: ['borrado', 'password'] },
        });
        return listado;
    }
    catch (error) {
        throw error;
    }
};
exports.listadoAutorizados = listadoAutorizados;
