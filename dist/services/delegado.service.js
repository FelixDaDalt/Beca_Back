"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listadoDelegados = exports.altaDelegado = void 0;
const password_handle_1 = require("../utils/password.handle");
const usuario_1 = require("../models/usuario");
const sequelize_1 = require("sequelize");
const altaDelegado = async (idColegio, nuevoDelegado, transaction) => {
    try {
        // 1. Verificar si el usuario existe por DNI
        const delegadoExistente = await usuario_1.usuario.findOne({
            where: {
                dni: nuevoDelegado.dni,
                borrado: 0
            },
            transaction,
        });
        if (delegadoExistente) {
            const error = new Error('El Dni ya se encuentra registrado');
            error.statusCode = 400;
            throw error;
        }
        // 2. Encriptar contraseña
        const passEncrypt = await (0, password_handle_1.encriptar)(nuevoDelegado.password);
        nuevoDelegado.password = passEncrypt;
        // 3. Agregar el delegado
        nuevoDelegado.id_rol = 2;
        nuevoDelegado.id_colegio = idColegio;
        nuevoDelegado.cambiarPass = 1;
        const agregarDelegado = await usuario_1.usuario.create(nuevoDelegado, { transaction }); // Incluye la transacción
        // 5. Devolver el token y los datos del usuario al cliente
        const { password, borrado, id_rol, ...DelegadoRegistrado } = agregarDelegado.dataValues;
        return { ...DelegadoRegistrado };
    }
    catch (error) {
        throw error;
    }
};
exports.altaDelegado = altaDelegado;
const listadoDelegados = async (idConsulta, id_colegio) => {
    try {
        const listado = await usuario_1.usuario.findAll({
            where: {
                id_rol: 2,
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
exports.listadoDelegados = listadoDelegados;
